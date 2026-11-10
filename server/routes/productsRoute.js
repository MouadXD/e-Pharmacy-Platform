const express = require("express");

const productsRouter = express.Router();

const {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  offers,
  uploadProductImage,
} = require("../controllers/productsController");

const requireAdmin = require("../middlewares/requireAdmin");
const requireAuth = require("../middlewares/requireAuth");
const upload = require("../middlewares/uploadImage");
const uploadImageCloud = require("../middlewares/uploadImageCloud");

const validateRequest = require("../middlewares/validateRequest");

const {
  createProductSchema,
  updateProductSchema,
} = require("../helpers/requestValidationSchemas");

productsRouter.get("/products", getAllProducts);
productsRouter.get("/offers", offers);
productsRouter.get("/products/:id", getProduct);
productsRouter.post(
  "/products",
  requireAuth,
  requireAdmin,
  validateRequest(createProductSchema),
  createProduct,
);
productsRouter.put(
  "/products/:id/upload",
  requireAuth,
  requireAdmin,
  upload.single("image"),
  uploadImageCloud,
  uploadProductImage
);
productsRouter.put(
  "/products/:id",
  requireAuth,
  requireAdmin,
  validateRequest(updateProductSchema),
  updateProduct,
);
productsRouter.delete(
  "/products/:id",
  requireAuth,
  requireAdmin,
  deleteProduct
);

module.exports = productsRouter;
