// models/Patient.js

const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
  zipcode: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: new Date(),
  },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
});

const Address = mongoose.model("Address", addressSchema);

module.exports = Address;
