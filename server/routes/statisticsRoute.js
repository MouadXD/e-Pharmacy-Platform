const express = require("express");

const statisticsRoutes = express.Router();

const requireAdmin = require("../middlewares/requireAdmin");
const requireAuth = require("../middlewares/requireAuth");
const getStatistics = require("../controllers/statisticsController");

statisticsRoutes.get("/statistics", requireAuth, requireAdmin, getStatistics);

module.exports = statisticsRoutes;
