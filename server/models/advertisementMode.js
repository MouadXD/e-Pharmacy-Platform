const { Schema, model } = require("mongoose");

const advertisementSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
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
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    priority: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

advertisementSchema.index({ priority: 1, createdAt: -1 });
advertisementSchema.index({ startDate: 1, endDate: 1 });

module.exports = model("advertisement", advertisementSchema);
