const { Schema, model } = require("mongoose");

const discountsSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    amount: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    applicableProducts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true },
);

discountsSchema.index({ applicableProducts: 1, startDate: 1, endDate: 1 });

module.exports = model("Discount", discountsSchema);
