const express = require("express");

const advertissementRoutes = express.Router();

const {
  getAds,
  createAds,
  uploadAdsImage,
  updateAds,
  deleteAds,
} = require("../controllers/advertissementController");

const requireAuth = require("../middlewares/requireAuth");
const requireAdmin = require("../middlewares/requireAdmin");
const validateRequest = require("../middlewares/validateRequest");
const {
  createAdsSchema,
  updateAdsSchema,
} = require("../helpers/requestValidationSchemas");

const upload = require("../middlewares/uploadImage");
const uploadImageCloud = require("../middlewares/uploadImageCloud");

advertissementRoutes.get("/ads", getAds);
advertissementRoutes.post(
  "/ads",
  requireAuth,
  requireAdmin,
  validateRequest(createAdsSchema),
  createAds,
);
advertissementRoutes.put(
  "/ads/:id/upload",
  requireAuth,
  requireAdmin,
  upload.single("image"),
  uploadImageCloud,
  uploadAdsImage,
);
advertissementRoutes.put(
  "/ads/:id",
  requireAuth,
  requireAdmin,
  validateRequest(updateAdsSchema),
  updateAds,
);
advertissementRoutes.delete("/ads/:id", requireAuth, requireAdmin, deleteAds);

module.exports = advertissementRoutes;
