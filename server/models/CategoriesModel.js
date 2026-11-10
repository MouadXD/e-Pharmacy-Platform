const { Schema, model } = require("mongoose");

const categoriesSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = model("Category", categoriesSchema);
