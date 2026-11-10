const express = require("express");

const ordersRoutes = express.Router();

const requireAuth = require("../middlewares/requireAuth");
const requireAdmin = require("../middlewares/requireAdmin");

const {
  getOrders,
  getUserOrders,
  getOrder,
  confirmOrder,
} = require("../controllers/ordersController");

ordersRoutes.get("/orders/:userId/user", requireAuth, getUserOrders);
ordersRoutes.get("/orders/:id", requireAuth, getOrder);
ordersRoutes.get("/orders", requireAuth, requireAdmin, getOrders);
ordersRoutes.post(
  "/orders/:id/confirmOrder",
  requireAuth,
  requireAdmin,
  confirmOrder
);

module.exports = ordersRoutes;
