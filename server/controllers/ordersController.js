const OrdersModel = require("../models/ordersModel");
const ProductsModel = require("../models/ProductsModel");
const CouponsModel = require("../models/CouponsModel");
const asyncHandler = require("express-async-handler");
const CustomError = require("../utils/customError");
const { validateMongoId } = require("../helpers/requestValidationSchemas");
const { getPagination } = require("../utils/security");
const {
  roundMoney,
  getActiveDiscountsForProducts,
  getEffectiveUnitPrice,
} = require("../helpers/pricing");

const normalizeShipping = (shippingAddress = {}) => ({
  fullName: String(shippingAddress.fullName || "").trim().slice(0, 150),
  phoneNumber: String(shippingAddress.phoneNumber || "").trim().slice(0, 30),
  street: String(shippingAddress.street || "").trim().slice(0, 200),
  city: String(shippingAddress.city || "").trim().slice(0, 100),
  state: String(shippingAddress.state || "").trim().slice(0, 100),
  zipCode: String(shippingAddress.zipCode || "").trim().slice(0, 20),
  country: String(shippingAddress.country || "").trim().slice(0, 100),
});

const buildOrderPayload = async (orderInfo = {}) => {
  if (
    !Array.isArray(orderInfo.cartItems) ||
    orderInfo.cartItems.length === 0 ||
    orderInfo.cartItems.length > 100
  ) {
    throw new CustomError("Cart is empty or too large", 400);
  }

  const quantitiesByProduct = new Map();

  for (const item of orderInfo.cartItems) {
    const productId = item?.productId || item?._id;
    validateMongoId(productId);

    const quantity = Number(item?.userQuantity ?? item?.quantity);

    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100) {
      throw new CustomError("Invalid product quantity", 400);
    }

    quantitiesByProduct.set(
      String(productId),
      (quantitiesByProduct.get(String(productId)) || 0) + quantity,
    );
  }

  const productIds = [...quantitiesByProduct.keys()];
  const [products, discountPercentByProduct] = await Promise.all([
    ProductsModel.find({ _id: { $in: productIds } }).select(
      "_id title price quantity",
    ),
    getActiveDiscountsForProducts(productIds),
  ]);

  if (products.length !== productIds.length) {
    throw new CustomError("One or more products do not exist", 400);
  }

  const productsById = new Map(
    products.map((product) => [String(product._id), product]),
  );

  const orderItems = [];
  let subTotal = 0;
  let totalQuantity = 0;

  for (const [productId, quantity] of quantitiesByProduct.entries()) {
    const product = productsById.get(productId);

    totalQuantity += quantity;

    if (totalQuantity > 500) {
      throw new CustomError("Order quantity is too large", 400);
    }

    if (!product || product.quantity < quantity) {
      throw new CustomError(
        `Insufficient stock for ${product?.title || "a product"}`,
        400,
      );
    }

    const price = getEffectiveUnitPrice(
      product.price,
      discountPercentByProduct.get(productId),
    );
    subTotal += price * quantity;

    orderItems.push({
      productId: product._id,
      title: product.title,
      quantity,
      price,
    });
  }

  subTotal = roundMoney(subTotal);

  let coupon = null;
  let discount = 0;
  const couponCode = orderInfo.couponCode
    ? String(orderInfo.couponCode).trim().slice(0, 50).toUpperCase()
    : null;

  if (couponCode) {
    const now = new Date();
    coupon = await CouponsModel.findOne({
      code: couponCode,
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
    });

    if (!coupon || coupon.usedCount >= coupon.usageLimit) {
      throw new CustomError("Coupon is invalid or has been used", 400);
    }

    if (subTotal < coupon.minimumPurchase) {
      throw new CustomError("Minimum purchase not met for this coupon", 400);
    }

    discount = subTotal * (coupon.discountValue / 100);
    if (coupon.maxDiscount !== null && coupon.maxDiscount !== undefined) {
      discount = Math.min(discount, coupon.maxDiscount);
    }
    discount = roundMoney(Math.min(discount, subTotal));
  }

  return {
    orderItems,
    subTotal,
    totalPrice: roundMoney(Math.max(subTotal - discount, 0)),
    discount,
    coupon,
    couponCode,
    shipping: normalizeShipping(orderInfo.shippingAdress || orderInfo.shipping),
  };
};

const decrementStock = async (orderItems) => {
  const decremented = [];

  try {
    for (const item of orderItems) {
      const product = await ProductsModel.findOneAndUpdate(
        { _id: item.productId, quantity: { $gte: item.quantity } },
        { $inc: { quantity: -item.quantity } },
        { new: true },
      );

      if (!product) {
        throw new CustomError(`Insufficient stock for ${item.title}`, 400);
      }

      decremented.push(item);
    }
  } catch (error) {
    await Promise.all(
      decremented.map((item) =>
        ProductsModel.updateOne(
          { _id: item.productId },
          { $inc: { quantity: item.quantity } },
        ),
      ),
    );
    throw error;
  }

  return decremented;
};

const restoreStock = async (orderItems) => {
  await Promise.all(
    orderItems.map((item) =>
      ProductsModel.updateOne(
        { _id: item.productId },
        { $inc: { quantity: item.quantity } },
      ),
    ),
  );
};

const incrementCouponUsage = async (couponId) => {
  if (!couponId) {
    return;
  }

  const coupon = await CouponsModel.findOneAndUpdate(
    {
      _id: couponId,
      $expr: { $lt: ["$usedCount", "$usageLimit"] },
    },
    { $inc: { usedCount: 1 } },
    { new: true },
  );

  if (!coupon) {
    throw new CustomError("Coupon usage limit reached", 400);
  }
};

const createPendingOrder = async (
  userId,
  orderInfo,
  paymentProvider,
  externalOrderId = null,
) => {
  validateMongoId(userId);

  const payload = await buildOrderPayload(orderInfo);

  return OrdersModel.create({
    userId,
    orderItems: payload.orderItems,
    subTotal: payload.subTotal,
    totalPrice: payload.totalPrice,
    discount: payload.discount,
    couponCode: payload.couponCode,
    shipping: payload.shipping,
    paymentProvider,
    paymentStatus: "PENDING",
    paypalOrderId: paymentProvider === "PAYPAL" ? externalOrderId : null,
  });
};

const finalizeOrder = async (orderId, paymentId) => {
  validateMongoId(orderId);

  const order = await OrdersModel.findById(orderId);

  if (!order) {
    throw new CustomError("Order not found", 404);
  }

  if (order.paymentStatus === "PAID") {
    return order;
  }

  let coupon = null;
  if (order.couponCode) {
    coupon = await CouponsModel.findOne({
      code: order.couponCode,
      isActive: true,
    });
  }

  const decremented = await decrementStock(order.orderItems);

  try {
    await incrementCouponUsage(coupon?._id);
  } catch (error) {
    await restoreStock(decremented);
    throw error;
  }

  order.paymentStatus = "PAID";
  order.paymentId = paymentId || null;
  order.paidAt = new Date();

  try {
    await order.save();
  } catch (error) {
    await restoreStock(decremented);

    if (coupon?._id) {
      await CouponsModel.updateOne(
        { _id: coupon._id },
        { $inc: { usedCount: -1 } },
      );
    }

    throw error;
  }

  return order;
};

// Kept for backwards compatibility with existing callers.
const saveOrder = async (userId, orderInfo) => {
  const order = await createPendingOrder(userId, orderInfo, "PAYPAL");
  return (await finalizeOrder(order._id, null))._id.toString();
};

const getUserOrders = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  validateMongoId(userId);

  if (String(userId) !== String(req.user) && req.userRole !== "admin") {
    throw new CustomError("Forbidden", 403);
  }

  const userOrders = await OrdersModel.find({ userId }).sort({ createdAt: -1 });

  return res.status(200).json({ success: true, status: 200, data: userOrders });
});

const getOrder = asyncHandler(async (req, res) => {
  const { id: orderId } = req.params;
  validateMongoId(orderId);

  const order = await OrdersModel.findById(orderId)
    .populate("userId", "_id firstName lastName email phoneNumber")
    .lean();

  if (!order) {
    throw new CustomError("Order not found", 404);
  }

  if (
    String(order.userId?._id) !== String(req.user) &&
    req.userRole !== "admin"
  ) {
    throw new CustomError("Forbidden", 403);
  }

  const userInfo = order.userId;
  delete order.userId;

  return res.status(200).json({
    success: true,
    status: 200,
    data: { ...order, userInfo },
  });
});

const getOrders = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query, 10, 100);

  const orders = await OrdersModel.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "userInfo",
        pipeline: [
          {
            $project: {
              _id: 1,
              firstName: 1,
              lastName: 1,
              email: 1,
              phoneNumber: 1,
            },
          },
        ],
      },
    },
    { $unwind: { path: "$userInfo", preserveNullAndEmptyArrays: true } },
    { $sort: { createdAt: -1 } },
    { $skip: skip },
    { $limit: limit },
  ]);

  const totalOrders = await OrdersModel.countDocuments();

  return res.status(200).json({
    success: true,
    status: 200,
    data: orders,
    pagination: {
      total: totalOrders,
      page,
      limit,
      totalPages: Math.ceil(totalOrders / limit),
    },
  });
});

const confirmOrder = asyncHandler(async (req, res) => {
  const { id: orderId } = req.params;
  validateMongoId(orderId);

  const order = await OrdersModel.findById(orderId);

  if (!order) {
    throw new CustomError("No order found", 404);
  }

  if (order.paymentStatus !== "PAID") {
    throw new CustomError("Only paid orders can be confirmed", 400);
  }

  await OrdersModel.updateOne(
    { _id: orderId },
    { $set: { deliveryStatus: "DELIVERED" } },
  );

  return res.status(200).json({
    success: true,
    status: 200,
    message: "Order confirmed successfully",
  });
});

module.exports = {
  saveOrder,
  createPendingOrder,
  finalizeOrder,
  getUserOrders,
  getOrder,
  getOrders,
  confirmOrder,
};
