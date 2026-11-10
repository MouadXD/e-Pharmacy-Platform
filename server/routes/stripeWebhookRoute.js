const express = require("express");
const Stripe = require("stripe");
const asyncHandler = require("express-async-handler");
const CustomError = require("../utils/customError");
const OrdersModel = require("../models/ordersModel");
const { finalizeOrder } = require("../controllers/ordersController");

const stripe = process.env.STRIPE_SECRET_KEY
  ? Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

const stripeWebhookRouter = express.Router();

stripeWebhookRouter.post(
  "/capture",
  express.raw({ type: "application/json", limit: "1mb" }),
  asyncHandler(async (req, res) => {
    if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
      throw new CustomError("Stripe webhook is not configured", 503);
    }

    const signature = req.headers["stripe-signature"];

    if (!signature) {
      throw new CustomError("Missing Stripe signature", 400);
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (error) {
      throw new CustomError("Invalid Stripe signature", 400);
    }

    if (
      event.type === "checkout.session.completed" &&
      event.data.object.payment_status === "paid"
    ) {
      const session = event.data.object;
      const orderId = session.metadata?.orderId;

      if (orderId) {
        const order = await OrdersModel.findById(orderId);

        if (
          !order ||
          String(order.userId) !== String(session.metadata?.userId)
        ) {
          throw new CustomError("Order not found for Stripe session", 404);
        }

        const shipping =
          session.shipping_details ||
          session.collected_information?.shipping_details;

        if (shipping) {
          order.shipping = {
            fullName:
              shipping.name ||
              session.customer_details?.name ||
              order.shipping?.fullName ||
              "",
            phoneNumber:
              session.customer_details?.phone || order.shipping?.phoneNumber || "",
            street: shipping.address?.line1 || "",
            city: shipping.address?.city || "",
            state: shipping.address?.state || "",
            zipCode: shipping.address?.postal_code || "",
            country: shipping.address?.country || "",
          };
          await order.save();
        }

        await finalizeOrder(
          orderId,
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.payment_intent?.id,
        );
      }
    }

    return res.status(200).json({ received: true });
  }),
);

module.exports = stripeWebhookRouter;
