const express = require("express");

const manufactoryRoutes = express.Router();

const requireAdmin = require("../middlewares/requireAdmin");
const requireAuth = require("../middlewares/requireAuth");
const validateRequest = require("../middlewares/validateRequest");
const {
  createManufactorySchema,
  updateManufactorySchema,
} = require("../helpers/requestValidationSchemas");

const {
  getAllManufactories,
  getManufactory,
  createManufactory,
  updateManufactory,
  deleteManufactory,
} = require("../controllers/manufactoriesController");

manufactoryRoutes.get("/manufactories", getAllManufactories);
manufactoryRoutes.get("/manufactories/:id", getManufactory);
manufactoryRoutes.post(
  "/manufactories",
  requireAuth,
  requireAdmin,
  validateRequest(createManufactorySchema),
  createManufactory,
);
manufactoryRoutes.put(
  "/manufactories/:id",
  requireAuth,
  requireAdmin,
  validateRequest(updateManufactorySchema),
  updateManufactory,
);
manufactoryRoutes.delete(
  "/manufactories/:id",
  requireAuth,
  requireAdmin,
  deleteManufactory,
);

module.exports = manufactoryRoutes;
