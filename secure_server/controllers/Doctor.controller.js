const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs").promises; // for file reading
const uuid = require("uuid");

const Doctor = require("../schemas/Doctor.schema");

// Controller to create a new doctor
exports.createDoctor = async (req, res) => {
  try {
    const { password, ...doctorData } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const doctorID = await generateUniqueDoctorId();
    const newDoctor = new Doctor({
      ...doctorData,
      doctorID: doctorID,
      password: hashedPassword,
    });
    const savedDoctor = await newDoctor.save();
    res.status(201).json(savedDoctor);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller to authenticate a doctor and return JWT tokens
exports.authenticateDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await Doctor.findOne({ email });

    if (!doctor) {
      return res
        .status(401)
        .json({ error: "Authentication failed. Invalid email or password." });
    }

    const passwordMatch = await bcrypt.compare(password, doctor.password);

    if (!passwordMatch) {
      return res
        .status(401)
        .json({ error: "Authentication failed. Invalid email or password." });
    }

    const privateKey = await fs.readFile("keys/private_key.pem", "utf8");
    const accessToken = jwt.sign({ doctorID: doctor.doctorID }, privateKey, {
      expiresIn: "15m",
      algorithm: "RS256",
    });
    const refreshToken = jwt.sign({ doctorID: doctor.doctorID }, privateKey, {
      expiresIn: "30d",
      algorithm: "RS256",
    });

    res.json({ accessToken, refreshToken });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller to get details of a specific doctor
exports.getDoctorDetails = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ doctorID: req.params.doctorID });
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }
    res.json(doctor);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller to update details of a specific doctor
exports.updateDoctorDetails = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ doctorID: req.params.doctorID });

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    const { password, ...doctorData } = req.body;
    if (password) {
      doctorData.password = await bcrypt.hash(password, 10);
    }

    const updatedDoctor = await Doctor.findByIdAndUpdate(
      doctor._id,
      doctorData,
      { new: true }
    );
    res.json(updatedDoctor);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller to delete a specific doctor
exports.deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ doctorID: req.params.doctorID });

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    await Doctor.findByIdAndRemove(doctor._id);
    res.json({ message: "Doctor deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const generateUniqueDoctorId = async () => {
  let doctorID;
  do {
    doctorID = uuid.v4().substring(0, 8); // Adjust the length as needed
  } while (await doctorIDExists(doctorID));

  return doctorID;
};

// Function to check if a Doctor ID already exists in the database
const doctorIDExists = async (doctorID) => {
  const existingDoctor = await Doctor.findOne({ doctorID });
  return existingDoctor !== null;
};
