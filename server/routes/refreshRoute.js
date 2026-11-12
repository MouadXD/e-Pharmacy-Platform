const express = require("express");

const refreshRoute = express.Router();

const refresh = require("../controllers/refreshController");
const { validateUnsafeRequestOrigin } = require("../utils/security");

refreshRoute.post("/refresh", validateUnsafeRequestOrigin, refresh);

module.exports = refreshRoute;
