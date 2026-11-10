const asyncHandler = require("express-async-handler");
const CustomError = require("../utils/customError");
const UserModel = require("../models/UsersModel");
const { validateMongoId } = require("../helpers/requestValidationSchemas");

/**
 * @desc Get user information
 * @route GET /api/v1/user/:id
 * @access private (same user only)
 */
const getUser = asyncHandler(async (req, res) => {
  const { id: userId } = req.params;
  validateMongoId(userId);

  const user = await UserModel.findById(userId).select(
    "_id firstName lastName gendre addresses phoneNumber email birthdayDate",
  );

  if (!user) {
    throw new CustomError("User not found", 404);
  }

  const isProfileComplete = Boolean(user.gendre && user.phoneNumber?.number);

  return res.status(200).json({ success: true, user, isProfileComplete });
});

/**
 * @desc Update user information
 * @route PUT /api/v1/user/:id
 * @access private (same user only)
 */
const updateUser = asyncHandler(async (req, res) => {
  const { id: userId } = req.params;
  validateMongoId(userId);

  const user = await UserModel.findByIdAndUpdate(
    userId,
    { $set: req.body },
    { new: true, runValidators: true },
  ).select(
    "_id firstName lastName gendre addresses phoneNumber email birthdayDate",
  );

  if (!user) {
    throw new CustomError("User not found", 404);
  }

  return res.status(200).json({ success: true, status: 200, user });
});

/**
 * @desc Delete user
 * @route DELETE /api/v1/user/:id
 * @access private (same user only)
 */
const deleteUser = asyncHandler(async (req, res) => {
  const { id: userId } = req.params;
  validateMongoId(userId);

  const user = await UserModel.findByIdAndDelete(userId);

  if (!user) {
    throw new CustomError("User not found", 404);
  }

  return res.status(200).json({ success: true, status: 200 });
});

module.exports = {
  getUser,
  updateUser,
  deleteUser,
};
