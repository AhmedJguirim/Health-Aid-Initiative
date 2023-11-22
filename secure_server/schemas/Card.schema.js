// models/Card.js

const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  valid: {
    type: Boolean,
    default: true,
  },
  validUntil: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  publicKey: {
    type: String,
    required: true,
  },
  pinCode: {
    type: String,
    required: true,
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
  },
});

const Card = mongoose.model("Card", cardSchema);

module.exports = Card;
