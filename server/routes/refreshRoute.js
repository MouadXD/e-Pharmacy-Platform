const express = require("express");

const refreshRoute = express.Router();

const refresh = require("../controllers/refreshController");
const {
  validateUnsafeRequestOrigin,
  requireCsrfToken,
} = require("../utils/security");

refreshRoute.post(
  "/refresh",
  validateUnsafeRequestOrigin,
  requireCsrfToken,
  refresh,
);

module.exports = refreshRoute;
