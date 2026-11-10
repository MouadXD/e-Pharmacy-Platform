const express = require("express");
const { rateLimit } = require("express-rate-limit");

const couponRoutes = express.Router();

const requireAdmin = require("../middlewares/requireAdmin");
const requireAuth = require("../middlewares/requireAuth");

const {
  getAllCoupons,
  getCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  checkCouponCode,
} = require("../controllers/couponsController");

const validateRequest = require("../middlewares/validateRequest");
const {
  checkCouponSchema,
  createCouponSchema,
  updateCouponSchema,
} = require("../helpers/requestValidationSchemas");

const couponCheckLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    status: 429,
    message: "Too many coupon checks, try again later",
  },
});

couponRoutes.get("/coupons", requireAuth, requireAdmin, getAllCoupons);
couponRoutes.get("/coupons/:id", requireAuth, requireAdmin, getCoupon);
couponRoutes.post(
  "/coupons",
  requireAuth,
  requireAdmin,
  validateRequest(createCouponSchema),
  createCoupon,
);
couponRoutes.put(
  "/coupons/:id",
  requireAuth,
  requireAdmin,
  validateRequest(updateCouponSchema),
  updateCoupon,
);
couponRoutes.delete("/coupons/:id", requireAuth, requireAdmin, deleteCoupon);

couponRoutes.post(
  "/checkCoupon",
  couponCheckLimiter,
  validateRequest(checkCouponSchema),
  checkCouponCode,
);

module.exports = couponRoutes;
