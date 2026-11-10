const jwt = require("jsonwebtoken");
const UserModel = require("../models/UsersModel");
const CustomError = require("../utils/customError");
const asyncErrorCatch = require("../utils/asyncErrorCatch");
const generateAccessToken = require("../helpers/generateAccessToken");
const generateRefreshToken = require("../helpers/generateRefreshToken");
const { validateMongoId } = require("../helpers/requestValidationSchemas");
const {
  hashToken,
  refreshCookieOptions,
  clearCookieOptions,
} = require("../utils/security");

/**
 * @desc Rotate a refresh token and issue a new access token
 * @route POST /api/v1/token/refresh
 * @access public (requires a valid refresh cookie)
 */
const refresh = asyncErrorCatch(async (req, res) => {
  const refreshToken = req.cookies?.refresh_token;

  if (!refreshToken || !process.env.REFRESH_TOKEN_SECRET) {
    throw new CustomError("Refresh token required", 401);
  }

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, {
      algorithms: ["HS256"],
      issuer: "online-pharmacy",
      audience: "online-pharmacy-client",
    });
  } catch (error) {
    res.clearCookie("refresh_token", clearCookieOptions());
    throw new CustomError("Invalid refresh token", 401);
  }

  if (
    decoded.type !== "refresh" ||
    !decoded.id ||
    !validateMongoId(decoded.id, false) ||
    !Number.isInteger(Number(decoded.tokenVersion))
  ) {
    res.clearCookie("refresh_token", clearCookieOptions());
    throw new CustomError("Invalid refresh token", 401);
  }

  const refreshTokenHash = hashToken(refreshToken);
  const newRefreshToken = generateRefreshToken(
    decoded.id,
    Number(decoded.tokenVersion),
  );

  // Consume the old token atomically so it cannot be replayed concurrently.
  const user = await UserModel.findOneAndUpdate(
    {
      _id: decoded.id,
      refreshToken: refreshTokenHash,
      isBlocked: { $ne: true },
      tokenVersion: Number(decoded.tokenVersion),
    },
    { $set: { refreshToken: hashToken(newRefreshToken) } },
    { new: true },
  ).select("_id tokenVersion");

  if (!user) {
    res.clearCookie("refresh_token", clearCookieOptions());
    throw new CustomError("Invalid refresh token", 401);
  }

  const accessToken = generateAccessToken(user._id, user.tokenVersion || 0);

  res.cookie("refresh_token", newRefreshToken, refreshCookieOptions());

  return res.status(200).json({
    success: true,
    status: 200,
    accessToken,
  });
});

module.exports = refresh;
