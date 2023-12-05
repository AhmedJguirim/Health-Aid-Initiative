const mongoose = require("mongoose");

const publicKeySchema = new mongoose.Schema({
  publicKey: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
});

module.exports = mongoose.model("Test", publicKeySchema);
