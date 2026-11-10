const express = require("express");

const refreshRoute = express.Router();

const refresh = require("../controllers/refreshController");

refreshRoute.post("/refresh", refresh);

module.exports = refreshRoute;
