const express = require("express");

const discountRoutes = express.Router();

const {
  getAllDiscounts,
  getDiscount,
  createDiscount,
  updateDiscount,
  deleteDiscount,
} = require("../controllers/discountsController");

const requireAdmin = require("../middlewares/requireAdmin");
const requireAuth = require("../middlewares/requireAuth");

const validateRequest = require("../middlewares/validateRequest");

const {
  createDiscountSchema,
  updateDiscountSchema,
} = require("../helpers/requestValidationSchemas");

discountRoutes.get(
  "/discounts",
  (req, res, next) => {
    // Valid public offers are visible on the storefront; the complete list is
    // reserved for administrators.
    if (req.query.valid === "1") {
      return next();
    }

    return requireAuth(req, res, (error) => {
      if (error) {
        return next(error);
      }
      return requireAdmin(req, res, next);
    });
  },
  getAllDiscounts,
);
discountRoutes.get("/discounts/:id", requireAuth, requireAdmin, getDiscount);
discountRoutes.post(
  "/discounts",
  requireAuth,
  requireAdmin,
  validateRequest(createDiscountSchema),
  createDiscount,
);
discountRoutes.put(
  "/discounts/:id",
  requireAuth,
  requireAdmin,
  validateRequest(updateDiscountSchema),
  updateDiscount,
);
discountRoutes.delete(
  "/discounts/:id",
  requireAuth,
  requireAdmin,
  deleteDiscount
);

module.exports = discountRoutes;
