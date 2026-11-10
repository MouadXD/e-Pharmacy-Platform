const { Schema, model } = require("mongoose");

const manufacturerSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = model("Manufactury", manufacturerSchema);
