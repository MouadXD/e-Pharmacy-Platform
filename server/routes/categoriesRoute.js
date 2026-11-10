const express = require("express");

const categoryRoutes = express.Router();

const {
  getAllCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoriesController");

const requireAdmin = require("../middlewares/requireAdmin");
const requireAuth = require("../middlewares/requireAuth");
const validateRequest = require("../middlewares/validateRequest");
const {
  createCategorySchema,
  updateCategorySchema,
} = require("../helpers/requestValidationSchemas");

categoryRoutes.get("/categories", getAllCategories);
categoryRoutes.get("/categories/:id", getCategory);
categoryRoutes.post(
  "/categories",
  requireAuth,
  requireAdmin,
  validateRequest(createCategorySchema),
  createCategory,
);
categoryRoutes.put(
  "/categories/:id",
  requireAuth,
  requireAdmin,
  validateRequest(updateCategorySchema),
  updateCategory,
);
categoryRoutes.delete(
  "/categories/:id",
  requireAuth,
  requireAdmin,
  deleteCategory,
);

module.exports = categoryRoutes;
