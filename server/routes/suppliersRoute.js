const express = require("express");

const supplierRoutes = express.Router();

const requireAdmin = require("../middlewares/requireAdmin");
const requireAuth = require("../middlewares/requireAuth");
const validateRequest = require("../middlewares/validateRequest");
const {
  createSupplierSchema,
  updateSupplierSchema,
} = require("../helpers/requestValidationSchemas");

const {
  getAllSuppliers,
  getSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} = require("../controllers/suppliersController");

supplierRoutes.get("/suppliers", requireAuth, requireAdmin, getAllSuppliers);
supplierRoutes.get("/suppliers/:id", requireAuth, requireAdmin, getSupplier);
supplierRoutes.post(
  "/suppliers",
  requireAuth,
  requireAdmin,
  validateRequest(createSupplierSchema),
  createSupplier,
);
supplierRoutes.put(
  "/suppliers/:id",
  requireAuth,
  requireAdmin,
  validateRequest(updateSupplierSchema),
  updateSupplier,
);
supplierRoutes.delete(
  "/suppliers/:id",
  requireAuth,
  requireAdmin,
  deleteSupplier,
);

module.exports = supplierRoutes;
