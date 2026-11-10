const express = require("express");

const adressesRoutes = express.Router();
const requireAuth = require("../middlewares/requireAuth");

const {
  getAllAdresses,
  getAdress,
  createAdress,
  updateAdress,
  deleteAdress,
} = require("../controllers/adressesController");
const validateRequest = require("../middlewares/validateRequest");
const { createAddressSchema } = require("../helpers/requestValidationSchemas");

adressesRoutes.get("/adresses", requireAuth, getAllAdresses);
adressesRoutes.get("/adresses/:id", requireAuth, getAdress);
adressesRoutes.post(
  "/adresses",
  requireAuth,
  validateRequest(createAddressSchema),
  createAdress,
);
adressesRoutes.put("/adresses/:id/default", requireAuth, updateAdress);
adressesRoutes.delete("/adresses/:id", requireAuth, deleteAdress);

module.exports = adressesRoutes;
