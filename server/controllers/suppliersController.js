const asyncHandler = require("express-async-handler");
const CustomError = require("../utils/customError");
const SuppliersModel = require("../models/SuppliersModel");
const { validateMongoId } = require("../helpers/requestValidationSchemas");
const { escapeRegex } = require("../utils/security");

/**
 * @desc Get all suppliers
 * @route GET /api/v1/suppliers
 * @access private (admin only)
 */
const getAllSuppliers = asyncHandler(async (req, res) => {
  const { search } = req.query;
  const queryObject = {};

  if (search) {
    queryObject.name = {
      $regex: escapeRegex(String(search).slice(0, 100)),
      $options: "i",
    };
  }

  const suppliers = await SuppliersModel.find(queryObject);

  return res
    .status(200)
    .json({ success: true, suppliers, total: suppliers.length });
});

/**
 * @desc Get a single supplier
 * @route GET /api/v1/suppliers/:id
 * @access private (admin only)
 */
const getSupplier = asyncHandler(async (req, res) => {
  const { id: supplierId } = req.params;
  validateMongoId(supplierId);

  const supplier = await SuppliersModel.findById(supplierId);

  if (!supplier) {
    throw new CustomError("Supplier not found", 404);
  }

  return res.status(200).json({ success: true, supplier });
});

/**
 * @desc Create a supplier
 * @route POST /api/v1/suppliers
 * @access private (admin only)
 */
const createSupplier = asyncHandler(async (req, res) => {
  const supplier = await SuppliersModel.create(req.body);

  return res.status(201).json({ success: true, supplier });
});

/**
 * @desc Update a supplier
 * @route PUT /api/v1/suppliers/:id
 * @access private (admin only)
 */
const updateSupplier = asyncHandler(async (req, res) => {
  const { id: supplierId } = req.params;
  validateMongoId(supplierId);

  const supplier = await SuppliersModel.findByIdAndUpdate(
    supplierId,
    { $set: req.body },
    { new: true, runValidators: true },
  );

  if (!supplier) {
    throw new CustomError("Supplier not found", 404);
  }

  return res.status(200).json({ success: true, supplier });
});

/**
 * @desc Delete a supplier
 * @route DELETE /api/v1/suppliers/:id
 * @access private (admin only)
 */
const deleteSupplier = asyncHandler(async (req, res) => {
  const { id: supplierId } = req.params;
  validateMongoId(supplierId);

  const supplier = await SuppliersModel.findByIdAndDelete(supplierId);

  if (!supplier) {
    throw new CustomError("Supplier not found", 404);
  }

  return res.status(200).json({ success: true });
});

module.exports = {
  getAllSuppliers,
  getSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier,
};
