const asyncHandler = require("express-async-handler");
const CustomError = require("../utils/customError");
const UsersModel = require("../models/UsersModel");
const { validateMongoId } = require("../helpers/requestValidationSchemas");

/**
 * @desc Get all addresses for the authenticated user
 * @route GET /api/v1/adresses
 * @access private
 */
const getAllAdresses = asyncHandler(async (req, res) => {
  validateMongoId(req.user);

  const { isDefault } = req.query;
  const userAddresses = await UsersModel.findById(req.user).select("addresses");

  if (!userAddresses) {
    throw new CustomError("User not found", 404);
  }

  if (isDefault === "true") {
    const defaultAddress = userAddresses.addresses.find(
      (address) => address.isDefault,
    );
    return res.status(200).json({
      success: true,
      status: 200,
      data: defaultAddress || null,
    });
  }

  return res.status(200).json({
    success: true,
    status: 200,
    data: userAddresses,
  });
});

/**
 * @desc Get a single address for the authenticated user
 * @route GET /api/v1/adresses/:id
 * @access private
 */
const getAdress = asyncHandler(async (req, res) => {
  const { id: addressId } = req.params;
  validateMongoId(addressId);

  const user = await UsersModel.findById(req.user).select("addresses");

  if (!user) {
    throw new CustomError("User not found", 404);
  }

  const address = user.addresses.find(
    (item) => item._id.toString() === addressId,
  );

  if (!address) {
    throw new CustomError("Address not found", 404);
  }

  return res.status(200).json({ success: true, status: 200, data: address });
});

/**
 * @desc Create an address
 * @route POST /api/v1/adresses
 * @access private
 */
const createAdress = asyncHandler(async (req, res) => {
  validateMongoId(req.user);

  const addressDetails = { ...req.body };
  const user = await UsersModel.findById(req.user).select("addresses");

  if (!user) {
    throw new CustomError("User not found", 404);
  }

  if (user.addresses.length === 0) {
    addressDetails.isDefault = true;
  }

  if (addressDetails.isDefault) {
    user.addresses.forEach((address) => {
      address.isDefault = false;
    });
  } else {
    addressDetails.isDefault = false;
  }

  user.addresses.push(addressDetails);
  const updatedUser = await user.save();

  return res.status(200).json({
    success: true,
    status: 200,
    data: updatedUser.addresses,
  });
});

/**
 * @desc Set an address as default
 * @route PUT /api/v1/adresses/:id/default
 * @access private
 */
const updateAdress = asyncHandler(async (req, res) => {
  const { id: addressId } = req.params;
  validateMongoId(addressId);

  const user = await UsersModel.findById(req.user).select("addresses");

  if (!user) {
    throw new CustomError("User not found", 404);
  }

  const addressExists = user.addresses.some(
    (address) => address._id.toString() === addressId,
  );

  if (!addressExists) {
    throw new CustomError("Address not found", 404);
  }

  user.addresses = user.addresses.map((address) => ({
    ...address.toObject(),
    isDefault: address._id.toString() === addressId,
  }));

  await user.save();

  return res.status(200).json({
    success: true,
    status: 200,
    data: user.addresses,
  });
});

/**
 * @desc Delete an address
 * @route DELETE /api/v1/adresses/:id
 * @access private
 */
const deleteAdress = asyncHandler(async (req, res) => {
  const { id: addressId } = req.params;
  validateMongoId(addressId);

  const user = await UsersModel.findById(req.user).select("addresses");

  if (!user) {
    throw new CustomError("User not found", 404);
  }

  const addressExists = user.addresses.some(
    (address) => address._id.toString() === addressId,
  );

  if (!addressExists) {
    throw new CustomError("Address not found", 404);
  }

  user.addresses = user.addresses.filter(
    (address) => address._id.toString() !== addressId,
  );

  if (
    user.addresses.length > 0 &&
    !user.addresses.some((address) => address.isDefault)
  ) {
    user.addresses[0].isDefault = true;
  }

  await user.save();

  return res.status(200).json({
    success: true,
    status: 200,
    data: user.addresses,
  });
});

module.exports = {
  getAllAdresses,
  getAdress,
  createAdress,
  updateAdress,
  deleteAdress,
};
