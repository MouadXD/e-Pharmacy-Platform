const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const giftCardsSchema = new Schema(
  {
    card: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    isRedemmed: {
      type: Boolean,
      required: true,
      default: false,
    },
    redemmedBy: {
      type: mongoose.Types.ObjectId,
      ref: "Users",
    },
    redemmedAt: {
      type: Date,
    },
    // userId: {
    //   type: mongoose.Types.ObjectId,
    //   ref: "Users",
    //   required: true,
    // },
    // country: {
    //   type: String,
    //   required: true,
    // },
    // phoneNumber: {
    //   type: Number,
    //   required: true,
    // },
    // firstAdresse: {
    //   type: String,
    //   required: true,
    // },
    // secondAdresse: String,
    // city: {
    //   type: String,
    //   required: true,
    // },
    // postalCode: {
    //   type: String,
    //   required: true,
    // },
  },
  { timestamps: true }
);

module.exports = model("giftCard", giftCardsSchema);
