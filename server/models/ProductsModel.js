const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const productsSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      main: {
        type: String,
        required: true,
      },
      benefits: {
        type: [String],
        required: true,
      },
      uses: {
        type: [String],
        required: true,
      },
      safetyInformations: {
        type: [String],
        required: true,
      },
    },
    image: {
      publicId: {
        type: String,
        default: null,
      },
      url: {
        type: String,
        default: null,
      },
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    prescripted: {
      type: Boolean,
      required: true,
      default: false,
    },
    categoryId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Category",
    },
    expiredAt: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

productsSchema.index({ categoryId: 1 });
productsSchema.index({ expiredAt: 1 });
productsSchema.index({ title: 1 });

module.exports = model("Product", productsSchema);
