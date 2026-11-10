require("dotenv").config();

const crypto = require("crypto");
const bcrypt = require("bcrypt");
const generateAccessToken = require("../helpers/generateAccessToken");
const generateRefreshToken = require("../helpers/generateRefreshToken");
const insertRefresh = require("../helpers/insertRefresh");
const UserModel = require("../models/UsersModel");
const CustomError = require("../utils/customError");
const asyncErrorHandler = require("../utils/asyncErrorCatch");
const sendEmail = require("./sendEmailController");
const { validateMongoId } = require("../helpers/requestValidationSchemas");
const {
  refreshCookieOptions,
  clearCookieOptions,
  hashToken,
} = require("../utils/security");

const BCRYPT_ROUNDS = Number(process.env.BCRYPT_ROUNDS) || 12;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const RESET_TOKEN_TTL_MS = 15 * 60 * 1000;
const DUMMY_PASSWORD_HASH = bcrypt.hashSync(
  "invalid-password-placeholder",
  BCRYPT_ROUNDS,
);

const issueSession = async (user, res) => {
  const accessToken = generateAccessToken(user._id, user.tokenVersion || 0);
  const refreshToken = generateRefreshToken(user._id, user.tokenVersion || 0);

  await insertRefresh(user._id, refreshToken);
  res.cookie("refresh_token", refreshToken, refreshCookieOptions());

  return accessToken;
};

/**
 * @desc Login
 * @route /api/v1/auth/login
 * @method POST
 * @access public
 */
const login = asyncErrorHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });
  const passwordHash = user?.password || DUMMY_PASSWORD_HASH;

  // Always run bcrypt so unknown accounts and accounts without a password do
  // not produce a noticeably faster response.
  const comparePassword = await bcrypt.compare(password, passwordHash);

  if (!user || !user.password || !comparePassword) {
    throw new CustomError("Invalid username or password.", 401);
  }

  if (user.isBlocked) {
    throw new CustomError("This account has been blocked.", 403);
  }

  const accessToken = await issueSession(user, res);

  return res.status(200).json({
    success: true,
    status: 200,
    userInfo: {
      accessToken,
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      isBlocked: user.isBlocked,
    },
  });
});

/**
 * @desc Register
 * @route /api/v1/auth/register
 * @method POST
 * @access public
 */
const register = asyncErrorHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const existingUser = await UserModel.findOne({ email });

  if (existingUser) {
    // Do not disclose whether the email is already registered.
    return res.status(201).json({
      success: true,
      status: 201,
      message: "If the details are valid, your account has been created.",
    });
  }

  const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);

  try {
    await UserModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      provider: "LOCAL",
    });
  } catch (error) {
    if (error?.code !== 11000) {
      throw error;
    }
  }

  return res.status(201).json({
    success: true,
    status: 201,
    message: "If the details are valid, your account has been created.",
  });
});

/**
 * @desc Forget Password
 * @route /api/v1/auth/forgetPassword
 * @method POST
 * @access public
 */
const forgetPassword = asyncErrorHandler(async (req, res) => {
  const { email } = req.body;
  const user = await UserModel.findOne({ email });

  // Always return the same response to avoid account enumeration.
  if (!user) {
    return res.status(200).json({
      success: true,
      status: 200,
      message: "If the account exists, a reset email has been sent.",
    });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenHash = hashToken(resetToken);

  await UserModel.updateOne(
    { _id: user._id },
    {
      $set: {
        passwordResetTokenHash: resetTokenHash,
        passwordResetExpiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
      },
    },
  );

  const resetPasswordURL = `${FRONTEND_URL}/auth/resetPassword/${user._id}/${resetToken}`;

  try {
    await sendEmail({
      personalizations: [
        {
          to: [{ email: user.email, name: user.firstName || "Medicare" }],
          dynamic_template_data: { resetPasswordURL },
        },
      ],
      templateId:
        process.env.RESET_PASSWORD_TEMPLATE_ID || "d-ef6bb46e1f1f4df0a2b3bc0778b352c0",
    });
  } catch (error) {
    // Do not expose email-provider errors or account existence to the client.
    console.error("Password reset email failed:", error.message);
  }

  return res.status(200).json({
    success: true,
    status: 200,
    message: "If the account exists, a reset email has been sent.",
  });
});

/**
 * @desc Reset Password
 * @route /api/v1/auth/resetPassword/:userId/:token
 * @method POST
 * @access public
 */
const resetPassword = asyncErrorHandler(async (req, res) => {
  const { userId, token } = req.params;
  const { password, confirmedPassword } = req.body;

  validateMongoId(userId);

  if (password !== confirmedPassword) {
    throw new CustomError("Passwords do not match", 400);
  }

  const passwordResetTokenHash = hashToken(token);

  const user = await UserModel.findOne({
    _id: userId,
    passwordResetTokenHash,
    passwordResetExpiresAt: { $gt: new Date() },
  }).select("+passwordResetTokenHash +passwordResetExpiresAt");

  if (!user) {
    throw new CustomError("Invalid or expired reset token", 400);
  }

  const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);

  await UserModel.updateOne(
    { _id: user._id, passwordResetTokenHash },
    {
      $set: { password: hashedPassword, refreshToken: null },
      $unset: { passwordResetTokenHash: 1, passwordResetExpiresAt: 1 },
      $inc: { tokenVersion: 1 },
    },
  );

  return res.status(200).json({
    success: true,
    status: 200,
    message: "Password reset successful. Please log in again.",
  });
});

/**
 * @desc Change Password
 * @route /api/v1/auth/changePassword/:id
 * @method PUT
 * @access private (same user only)
 */
const changePassword = asyncErrorHandler(async (req, res) => {
  const { id: userId } = req.params;
  const { oldPassword, newPassword } = req.body;

  validateMongoId(userId);

  const user = await UserModel.findById(userId).select("password tokenVersion");

  if (!user || !user.password) {
    throw new CustomError("User not found", 404);
  }

  const isPasswordMatched = await bcrypt.compare(oldPassword, user.password);

  if (!isPasswordMatched) {
    throw new CustomError("Old password is incorrect", 400);
  }

  const newPasswordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);

  await UserModel.updateOne(
    { _id: userId },
    {
      $set: { password: newPasswordHash, refreshToken: null },
      $inc: { tokenVersion: 1 },
    },
  );

  res.clearCookie("refresh_token", clearCookieOptions());

  return res.status(200).json({
    success: true,
    status: 200,
    message: "Password changed successfully. Please log in again.",
  });
});

const saveGoogleUser = async (userInfo) => {
  const { sub, given_name, family_name, email, email_verified } =
    userInfo._json;
  const normalizedEmail = String(email || "").toLowerCase().trim();

  if (!sub || !normalizedEmail) {
    throw new CustomError("Google account information is incomplete", 400);
  }

  if (email_verified === false) {
    throw new CustomError("Google account email is not verified", 403);
  }

  let user = await UserModel.findOne({
    $or: [{ googleId: sub }, { email: normalizedEmail }],
  });

  if (user) {
    if (user.isBlocked) {
      throw new CustomError("This account has been blocked.", 403);
    }

    if (!user.googleId) {
      user.googleId = sub;
    }
    if (user.provider !== "GOOGLE") {
      user.provider = "GOOGLE";
    }
    await user.save();
  } else {
    user = await UserModel.create({
      googleId: sub,
      firstName: given_name || "Google",
      lastName: family_name || "User",
      email: normalizedEmail,
      provider: "GOOGLE",
    });
  }

  return {
    userInfo: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      accessToken: generateAccessToken(user._id, user.tokenVersion || 0),
      provider: user.provider,
    },
    tokenVersion: user.tokenVersion || 0,
  };
};

module.exports = {
  login,
  register,
  forgetPassword,
  resetPassword,
  changePassword,
  saveGoogleUser,
};
