const mongoose = require("mongoose");
const { Schema } = mongoose;

const specialitySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const Speciality = mongoose.model("Speciality", specialitySchema);

module.exports = Speciality;
