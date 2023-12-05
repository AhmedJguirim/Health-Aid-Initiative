const mongoose = require("mongoose");
const { Schema } = mongoose;

const doctorSchema = new Schema({
  doctorID: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  birthDate: {
    type: Date,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  licenseNumber: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  publicKey: {
    type: String, // Assuming the publicKey is a string
    required: true,
  },
  specialities: [
    {
      type: Schema.Types.ObjectId,
      ref: "Speciality",
    },
  ],
});

const Doctor = mongoose.model("Doctor", doctorSchema);

module.exports = Doctor;
