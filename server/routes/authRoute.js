const express = require("express");
const passport = require("passport");
const { rateLimit } = require("express-rate-limit");

const authRoute = express.Router();

const requireAuth = require("../middlewares/requireAuth");
const isCurrentUser = require("../middlewares/isCurrentUser");
const checkRecaptchaToken = require("../middlewares/checkRecaptchaToken");
const asyncErrorHandler = require("../utils/asyncErrorCatch");
const UserModel = require("../models/UsersModel");
const {
  hashToken,
  clearCookieOptions,
  isProduction,
  refreshCookieOptions,
  validateUnsafeRequestOrigin,
  requireCsrfToken,
} = require("../utils/security");

const recaptchaMiddleware =
  process.env.NODE_ENV === "production"
    ? checkRecaptchaToken
    : (req, res, next) => next();

const {
  login,
  register,
  forgetPassword,
  resetPassword,
  changePassword,
  saveGoogleUser,
} = require("../controllers/authController");
const generateRefreshToken = require("../helpers/generateRefreshToken");
const insertRefresh = require("../helpers/insertRefresh");

const validateRequest = require("../middlewares/validateRequest");

const {
  loginSchema,
  registerSchema,
  forgetPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} = require("../helpers/requestValidationSchemas");

const limiterOptions = {
  windowMs: 15 * 60 * 1000,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    res.status(options.statusCode).json({
      success: false,
      status: options.statusCode,
      message: "Too many requests, try again later",
      retryAfter: options.windowMs / 1000,
    });
  },
};

const authLimiter = rateLimit({
  ...limiterOptions,
  max: 5,
});

const resetLimiter = rateLimit({
  ...limiterOptions,
  max: 5,
});

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const API_URL = process.env.API_URL || "http://localhost:8000";

authRoute.post(
  "/register",
  authLimiter,
  validateRequest(registerSchema),
  recaptchaMiddleware,
  register,
);

authRoute.post(
  "/login",
  validateUnsafeRequestOrigin,
  authLimiter,
  validateRequest(loginSchema),
  recaptchaMiddleware,
  login,
);

authRoute.post(
  "/forgetPassword",
  authLimiter,
  validateRequest(forgetPasswordSchema),
  recaptchaMiddleware,
  forgetPassword,
);

authRoute.post(
  "/resetPassword/:userId/:token",
  resetLimiter,
  validateRequest(resetPasswordSchema),
  resetPassword,
);

authRoute.put(
  "/changePassword/:id",
  resetLimiter,
  validateRequest(changePasswordSchema),
  requireAuth,
  isCurrentUser,
  changePassword,
);

authRoute.get(
  "/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
    state: true,
  }),
);

authRoute.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: `${API_URL}/api/v1/auth/google/success`,
    failureRedirect: `${API_URL}/api/v1/auth/google/failure`,
  }),
);

authRoute.get(
  "/google/success",
  asyncErrorHandler(async (req, res) => {
    const user = req?.session?.passport?.user;

    if (!user) {
      return res.status(403).json({
        success: false,
        message: "Not Authorized",
      });
    }

    const { userInfo, tokenVersion } = await saveGoogleUser(user);
    const refreshToken = generateRefreshToken(userInfo.id, tokenVersion);
    await insertRefresh(userInfo.id, refreshToken);
    res.cookie("refresh_token", refreshToken, refreshCookieOptions());

    // The current frontend reads this cookie directly. Keep it short-lived and
    // only over HTTPS in production until the OAuth flow is migrated to a
    // one-time code exchange.
    res.cookie("user", JSON.stringify(userInfo), {
      httpOnly: false,
      secure: isProduction(),
      sameSite: "lax",
      path: "/",
      maxAge: 5 * 60 * 1000,
    });

    return res.redirect(FRONTEND_URL);
  }),
);

authRoute.get("/google/failure", async (req, res) => {
  return res.redirect(`${FRONTEND_URL}/auth/login`);
});

authRoute.post(
  "/logout",
  validateUnsafeRequestOrigin,
  requireCsrfToken,
  asyncErrorHandler(async (req, res) => {
    const refreshToken = req.cookies?.refresh_token;

    if (refreshToken) {
      const user = await UserModel.findOne({
        refreshToken: hashToken(refreshToken),
      }).select("_id");

      if (user) {
        await UserModel.updateOne(
          { _id: user._id },
          { $set: { refreshToken: null }, $inc: { tokenVersion: 1 } },
        );
      }
    }

    if (req.session) {
      await new Promise((resolve) => req.session.destroy(() => resolve()));
    }

    res.clearCookie("refresh_token", clearCookieOptions());
    res.clearCookie("connect.sid", clearCookieOptions());
    res.clearCookie("user", clearCookieOptions());

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Logged out successfully",
    });
  }),
);

module.exports = authRoute;
