const express = require("express");
const asyncHandler = require("express-async-handler");

const paypalRouter = express.Router();

const requireAuth = require("../middlewares/requireAuth.js");
const { createOrder, captureOrder } = require("../helpers/paypal-api.js");
const {
  createPendingOrder,
  finalizeOrder,
} = require("../controllers/ordersController.js");
const OrdersModel = require("../models/ordersModel.js");
const CustomError = require("../utils/customError.js");

const toPayPalShipping = (shipping = {}) => ({
  name: {
    full_name: shipping.fullName || "Customer",
  },
  address: {
    address_line_1: shipping.street || "",
    postal_code: shipping.zipCode || "",
    admin_area_2: shipping.city || "",
    country_code: "MA",
  },
});

paypalRouter.post(
  "/paypal/orders",
  requireAuth,
  asyncHandler(async (req, res) => {
    if (
      !process.env.PAYPAL_CLIENT_ID ||
      !process.env.PAYPAL_CLIENT_SECRET
    ) {
      throw new CustomError("PayPal is not configured", 503);
    }

    const orderInfo = req.body?.orderInfo;

    if (!orderInfo || typeof orderInfo !== "object") {
      throw new CustomError("Order information is required", 400);
    }

    let pendingOrder;

    try {
      pendingOrder = await createPendingOrder(req.user, orderInfo, "PAYPAL");

      const amount = {
        currency_code: "USD",
        value: pendingOrder.totalPrice.toFixed(2),
      };

      const { jsonResponse, httpStatusCode } = await createOrder(
        amount,
        toPayPalShipping(pendingOrder.shipping),
      );

      if (
        httpStatusCode === 201 &&
        jsonResponse?.status === "CREATED" &&
        jsonResponse?.id
      ) {
        pendingOrder.paypalOrderId = jsonResponse.id;
        await pendingOrder.save();
      } else {
        await OrdersModel.deleteOne({ _id: pendingOrder._id });
      }

      return res.status(httpStatusCode).json(jsonResponse);
    } catch (error) {
      if (pendingOrder?._id) {
        await OrdersModel.deleteOne({ _id: pendingOrder._id });
      }
      throw error;
    }
  }),
);

paypalRouter.post(
  "/paypal/orders/:orderID/capture",
  requireAuth,
  asyncHandler(async (req, res) => {
    if (
      !process.env.PAYPAL_CLIENT_ID ||
      !process.env.PAYPAL_CLIENT_SECRET
    ) {
      throw new CustomError("PayPal is not configured", 503);
    }

    const { orderID } = req.params;

    if (!/^[A-Za-z0-9-]{1,50}$/.test(String(orderID))) {
      throw new CustomError("Invalid order id", 400);
    }

    const order = await OrdersModel.findOne({
      paypalOrderId: orderID,
      userId: req.user,
      paymentProvider: "PAYPAL",
    });

    if (!order) {
      throw new CustomError("Order not found", 404);
    }

    if (order.paymentStatus === "PAID") {
      return res.status(200).json({
        success: true,
        status: 200,
        message: "Order already paid",
      });
    }

    const { jsonResponse, httpStatusCode } = await captureOrder(orderID);

    if (jsonResponse?.status === "COMPLETED") {
      const captureId =
        jsonResponse.purchase_units?.[0]?.payments?.captures?.[0]?.id || null;
      await finalizeOrder(order._id, captureId);
    }

    return res.status(httpStatusCode).json(jsonResponse);
  }),
);

module.exports = paypalRouter;
