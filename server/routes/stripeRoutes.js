const express = require("express");
const Stripe = require("stripe");
const asyncHandler = require("express-async-handler");
const requireAuth = require("../middlewares/requireAuth");
const ProductsModel = require("../models/ProductsModel");
const OrdersModel = require("../models/ordersModel");
const { createPendingOrder } = require("../controllers/ordersController");
const CustomError = require("../utils/customError");
const { validateMongoId } = require("../helpers/requestValidationSchemas");
const {
  getActiveDiscountsForProducts,
  getEffectiveUnitPrice,
} = require("../helpers/pricing");

const stripe = process.env.STRIPE_SECRET_KEY
  ? Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

const stripeRouter = express.Router();
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const resolveLineItems = async (cart) => {
  if (!Array.isArray(cart) || cart.length === 0 || cart.length > 100) {
    throw new CustomError("Invalid cart", 400);
  }

  const lineItems = [];
  const orderItems = [];

  for (const item of cart) {
    const quantity = Number(item?.quantity ?? item?.userQuantity);

    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100) {
      throw new CustomError("Invalid cart quantity", 400);
    }

    let product = null;

    if (item?.productId || item?._id) {
      const productId = item.productId || item._id;
      validateMongoId(productId);
      product = await ProductsModel.findById(productId);
    } else {
      const productName = item?.price_data?.product_data?.name;
      if (!productName || typeof productName !== "string") {
        throw new CustomError("A valid product id is required", 400);
      }
      product = await ProductsModel.findOne({
        title: productName.trim().slice(0, 200),
      });
    }

    if (!product) {
      throw new CustomError("Product not found", 400);
    }

    const discountPercentByProduct = await getActiveDiscountsForProducts([
      product._id,
    ]);
    const effectivePrice = getEffectiveUnitPrice(
      product.price,
      discountPercentByProduct.get(String(product._id)),
    );
    const unitAmount = Math.round(effectivePrice * 100);

    if (!Number.isInteger(unitAmount) || unitAmount <= 0) {
      throw new CustomError("Invalid product price", 400);
    }

    lineItems.push({
      price_data: {
        currency: "mad",
        product_data: {
          name: product.title,
          ...(product.image?.url ? { images: [product.image.url] } : {}),
        },
        unit_amount: unitAmount,
      },
      quantity,
    });

    orderItems.push({
      productId: product._id.toString(),
      userQuantity: quantity,
    });
  }

  return { lineItems, orderItems };
};

stripeRouter.post(
  "/create-checkout-session",
  requireAuth,
  asyncHandler(async (req, res) => {
    if (!stripe) {
      throw new CustomError("Stripe is not configured", 503);
    }

    if (req.body?.couponCode) {
      throw new CustomError(
        "Coupons are not supported for Stripe checkout",
        400,
      );
    }

    const { lineItems, orderItems } = await resolveLineItems(req.body?.cart);
    const customer = await stripe.customers.create({
      metadata: { userId: req.user },
    });

    let pendingOrder;

    try {
      pendingOrder = await createPendingOrder(
        req.user,
        {
          cartItems: orderItems,
        },
        "STRIPE",
      );

      const session = await stripe.checkout.sessions.create({
        shipping_address_collection: {
          allowed_countries: ["MA"],
        },
        shipping_options: [
          {
            shipping_rate_data: {
              type: "fixed_amount",
              fixed_amount: { amount: 0, currency: "mad" },
              display_name: "Free shipping",
              delivery_estimate: {
                minimum: { unit: "business_day", value: 5 },
                maximum: { unit: "business_day", value: 7 },
              },
            },
          },
          {
            shipping_rate_data: {
              type: "fixed_amount",
              fixed_amount: { amount: 1500, currency: "mad" },
              display_name: "Next day air",
              delivery_estimate: {
                minimum: { unit: "business_day", value: 1 },
                maximum: { unit: "business_day", value: 1 },
              },
            },
          },
        ],
        payment_method_types: ["card"],
        customer: customer.id,
        line_items: lineItems,
        mode: "payment",
        success_url: `${FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${FRONTEND_URL}/checkout/failure`,
        metadata: {
          userId: req.user,
          orderId: pendingOrder._id.toString(),
        },
      });

      return res.status(200).json({ url: session.url });
    } catch (error) {
      if (pendingOrder?._id) {
        await OrdersModel.deleteOne({ _id: pendingOrder._id });
      }
      throw error;
    }
  }),
);

module.exports = stripeRouter;
