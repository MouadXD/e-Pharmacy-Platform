const asyncHandler = require("express-async-handler");
const CustomError = require("../utils/customError");
const ManufactoriesModel = require("../models/ManufacturersModel");
const { validateMongoId } = require("../helpers/requestValidationSchemas");
const { escapeRegex } = require("../utils/security");

/**
 * @desc Get All Manufactories
 * @route /api/v1/manufactories
 * @method GET
 * @access public
 */

const getAllManufactories = asyncHandler(async (req, res, next) => {
  const { search } = req.query;
  const queryObject = {};

  if (search) {
    queryObject.title = {
      $regex: escapeRegex(String(search).slice(0, 100)),
      $options: "i",
    };
  }

  const manufactories = await ManufactoriesModel.find(queryObject);

  res
    .status(200)
    .json({ success: true, manufactories, total: manufactories.length });
});

/**
 * @desc Get Single Manufactory
 * @route /api/v1/manufactories/:id
 * @method GET
 * @access public
 */

const getManufactory = asyncHandler(async (req, res, next) => {
  const { id: manufactoryId } = req.params;

  validateMongoId(manufactoryId);

  const manufactory = await ManufactoriesModel.findById(manufactoryId);

  if (!manufactory) {
    throw new CustomError("resource not found", 404);
  }

  res.status(200).json({ success: true, manufactory });
});

/**
 * @desc Create Manufactory
 * @route /api/v1/manufactories
 * @method POST
 * @access private (admin only)
 */

const createManufactory = asyncHandler(async (req, res, next) => {
  const manufactoryDetails = req.body;

  const manufactory = await ManufactoriesModel.create(manufactoryDetails);

  res.status(201).json({ success: true, manufactory });
});

/**
 * @desc Update Manufactory
 * @route /api/v1/manufactories/:id
 * @method PUT
 * @access private (admin only)
 */

const updateManufactory = asyncHandler(async (req, res, next) => {
  const { id: manufactoryId } = req.params;

  validateMongoId(manufactoryId);

  const manufactoryDetails = req.body;

  const manufactory = await ManufactoriesModel.findByIdAndUpdate(
    manufactoryId,
    { $set: manufactoryDetails },
    { new: true, runValidators: true },
  );

  if (!manufactory) {
    throw new CustomError("resource not found", 404);
  }

  res.status(200).json({ success: true, manufactory });
});

/**
 * @desc Delete Manufactory
 * @route /api/v1/manufactories/:id
 * @method DELETE
 * @access private (admin only)
 */

const deleteManufactory = asyncHandler(async (req, res, next) => {
  const { id: manufactoryId } = req.params;

  validateMongoId(manufactoryId);

  const manufactory = await ManufactoriesModel.findByIdAndDelete(manufactoryId);

  if (!manufactory) {
    throw new CustomError("resource not found", 404);
  }

  res.status(200).json({ success: true });
});

module.exports = {
  getAllManufactories,
  getManufactory,
  createManufactory,
  updateManufactory,
  deleteManufactory,
};
