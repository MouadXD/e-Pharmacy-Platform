const asyncHandler = require("express-async-handler");
const CustomError = require("../utils/customError");
const CategoriesModel = require("../models/CategoriesModel");
const ProductsModel = require("../models/ProductsModel");
const { validateMongoId } = require("../helpers/requestValidationSchemas");

/**
 * @desc Get all categories
 * @route GET /api/v1/categories
 * @access public
 */
const getAllCategories = asyncHandler(async (req, res) => {
  const [categories, productCounts] = await Promise.all([
    CategoriesModel.find().sort({ createdAt: -1 }),
    ProductsModel.aggregate([
      { $group: { _id: "$categoryId", totalProducts: { $sum: 1 } } },
    ]),
  ]);

  const countsByCategory = new Map(
    productCounts.map((item) => [String(item._id), item.totalProducts]),
  );

  const categoriesWithTotalProducts = categories.map((category) => ({
    ...category.toObject(),
    totalProducts: countsByCategory.get(String(category._id)) || 0,
  }));

  return res
    .status(200)
    .json({ success: true, data: categoriesWithTotalProducts });
});

/**
 * @desc Get a single category
 * @route GET /api/v1/categories/:id
 * @access public
 */
const getCategory = asyncHandler(async (req, res) => {
  const { id: categoryId } = req.params;
  validateMongoId(categoryId);

  const category = await CategoriesModel.findById(categoryId);

  if (!category) {
    throw new CustomError("Category not found", 404);
  }

  return res.status(200).json({ success: true, data: category });
});

/**
 * @desc Create a category
 * @route POST /api/v1/categories
 * @access private (admin only)
 */
const createCategory = asyncHandler(async (req, res) => {
  const categoryDetails = req.body;

  const searchCategory = await CategoriesModel.findOne({
    title: categoryDetails.title,
  });

  if (searchCategory) {
    throw new CustomError("This category already exists.", 409);
  }

  const category = await CategoriesModel.create(categoryDetails);

  return res.status(201).json({ success: true, category });
});

/**
 * @desc Update a category
 * @route PUT /api/v1/categories/:id
 * @access private (admin only)
 */
const updateCategory = asyncHandler(async (req, res) => {
  const { id: categoryId } = req.params;
  validateMongoId(categoryId);

  const category = await CategoriesModel.findByIdAndUpdate(
    categoryId,
    { $set: req.body },
    { new: true, runValidators: true },
  );

  if (!category) {
    throw new CustomError("Category not found", 404);
  }

  return res.status(200).json({ success: true, data: category });
});

/**
 * @desc Delete a category
 * @route DELETE /api/v1/categories/:id
 * @access private (admin only)
 */
const deleteCategory = asyncHandler(async (req, res) => {
  const { id: categoryId } = req.params;
  validateMongoId(categoryId);

  const category = await CategoriesModel.findByIdAndDelete(categoryId);

  if (!category) {
    throw new CustomError("Category not found", 404);
  }

  return res.status(200).json({ status: 200, success: true });
});

module.exports = {
  getAllCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
