// schemas/Allergie.schema.js

const mongoose = require("mongoose");

const allergieSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const Allergie = mongoose.model("Allergie", allergieSchema);

module.exports = Allergie;
