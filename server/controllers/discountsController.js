const asyncHandler = require("express-async-handler");
const CustomError = require("../utils/customError");
const DiscountsModel = require("../models/DiscountsModel");
const ProductsModel = require("../models/ProductsModel");
const { validateMongoId } = require("../helpers/requestValidationSchemas");

/**
 * @desc Get all discounts
 * @route GET /api/v1/discounts
 * @access public when valid=1, otherwise admin only (enforced by the route)
 */
const getAllDiscounts = asyncHandler(async (req, res) => {
  const { valid, productId } = req.query;
  const queryObject = {};

  if (valid === "1") {
    const currentDate = new Date();
    queryObject.startDate = { $lte: currentDate };
    queryObject.endDate = { $gte: currentDate };
  }

  if (productId) {
    validateMongoId(productId);
    queryObject.applicableProducts = { $in: [productId] };
  }

  const discounts = await DiscountsModel.find(queryObject).sort({
    createdAt: -1,
  });

  const productIds = [
    ...new Set(
      discounts.flatMap((discount) =>
        discount.applicableProducts.map((id) => String(id)),
      ),
    ),
  ];

  const products = await ProductsModel.find({ _id: { $in: productIds } })
    .select("_id title image description")
    .lean();

  const productsById = new Map(
    products.map((product) => [String(product._id), product]),
  );

  const discountsWithProductInfo = discounts.map((discount) => ({
    ...discount.toObject(),
    productDetails: discount.applicableProducts
      .map((id) => productsById.get(String(id)))
      .filter(Boolean),
  }));

  return res.status(200).json({
    success: true,
    status: 200,
    data: discountsWithProductInfo,
  });
});

/**
 * @desc Get a single discount
 * @route GET /api/v1/discounts/:id
 * @access private (admin only)
 */
const getDiscount = asyncHandler(async (req, res) => {
  const { id: discountId } = req.params;
  validateMongoId(discountId);

  const discount = await DiscountsModel.findById(discountId);

  if (!discount) {
    throw new CustomError("Discount not found", 404);
  }

  return res.status(200).json({ success: true, status: 200, data: discount });
});

/**
 * @desc Create a discount
 * @route POST /api/v1/discounts
 * @access private (admin only)
 */
const createDiscount = asyncHandler(async (req, res) => {
  const discountDetails = req.body;

  const isDiscountExist = await DiscountsModel.findOne({
    name: discountDetails.name,
    startDate: discountDetails.startDate,
    endDate: discountDetails.endDate,
  });

  if (isDiscountExist) {
    throw new CustomError("Discount already exists", 409);
  }

  const discount = await DiscountsModel.create(discountDetails);

  return res
    .status(201)
    .json({ success: true, status: 201, data: discount });
});

/**
 * @desc Update a discount
 * @route PUT /api/v1/discounts/:id
 * @access private (admin only)
 */
const updateDiscount = asyncHandler(async (req, res) => {
  const { id: discountId } = req.params;
  validateMongoId(discountId);

  const discountDetails = req.body;
  const existingDiscount = await DiscountsModel.findById(discountId);

  if (!existingDiscount) {
    throw new CustomError("Discount not found", 404);
  }

  const startDate = discountDetails.startDate ?? existingDiscount.startDate;
  const endDate = discountDetails.endDate ?? existingDiscount.endDate;

  if (new Date(endDate) < new Date(startDate)) {
    throw new CustomError("End date must be after start date", 400);
  }

  const discount = await DiscountsModel.findByIdAndUpdate(
    discountId,
    { $set: discountDetails },
    { new: true, runValidators: true },
  );

  return res.status(200).json({ success: true, status: 200, data: discount });
});

/**
 * @desc Delete a discount
 * @route DELETE /api/v1/discounts/:id
 * @access private (admin only)
 */
const deleteDiscount = asyncHandler(async (req, res) => {
  const { id: discountId } = req.params;
  validateMongoId(discountId);

  const discount = await DiscountsModel.findByIdAndDelete(discountId);

  if (!discount) {
    throw new CustomError("Discount not found", 404);
  }

  return res.status(200).json({ success: true, status: 200 });
});

module.exports = {
  getAllDiscounts,
  getDiscount,
  createDiscount,
  updateDiscount,
  deleteDiscount,
};
