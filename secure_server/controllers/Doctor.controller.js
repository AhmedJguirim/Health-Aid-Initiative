const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs").promises; // for file reading
const uuid = require("uuid");
const forge = require("node-forge");

const Doctor = require("../schemas/Doctor.schema");
const Speciality = require("../schemas/Speciality.schema");

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

    res.status(201).json({ message: "Doctor created successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.createDoctorEncrypted = async (req, res) => {
  try {
    const doctorID = await generateUniqueDoctorId();
    const privateKey = await fs.readFile("keys/private_key.pem", "utf8");
    const pvkey = forge.pki.privateKeyFromPem(privateKey);
    const doctor = pvkey.decrypt(req.body.data);
    doctor = JSON.parse(doctor);
    console.log(doctor);
    const hashedPassword = await bcrypt.hash(doctor.password, 10);
    const newDoctor = new Doctor({
      ...doctor,
      publicKey: req.body.publicKey,
      doctorID: doctorID,
      password: hashedPassword,
    });
    const savedDoctor = await newDoctor.save();

    res.status(201).json({ message: "Doctor created successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller to authenticate a doctor and return JWT tokens
exports.authenticateDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email);
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
    const publicKey = await fs.readFile(
      "keys/public_key_webServer.pem",
      "utf8"
    );
    const pbkey = forge.pki.publicKeyFromPem(publicKey);
    console.log(doctor.id);
    const doctor_id = pbkey.encrypt(doctor.id);

    res.json({ doctor_id });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller to get details of a specific doctor
exports.getDoctorDetails = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.doctorID).select(
      "-password"
    );
    const publicKey = forge.pki.publicKeyFromPem(doctor.publicKey);
    const encryptedData = publicKey.encrypt(
      JSON.stringify({
        name: doctor.name,
        email: doctor.email,
        birthDate: doctor.birthDate,
        phoneNumber: doctor.phoneNumber,
        licenseNumber: doctor.licenseNumber,
      })
    );
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }
    res.json(encryptedData);
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
exports.searchDoctorByName = async (req, res) => {
  try {
    const doctor = await Doctor.find({
      name: { $regex: req.query.name, $options: "i" },
    }).populate("speciality");

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    res.json({ doctor });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.searchDoctorByName = async (req, res) => {
  console.log(req.query.name);
  try {
    const doctors = await Doctor.find({
      name: { $regex: req.query.name, $options: "i" },
    })
      .populate("specialities")
      .select("name specitialities");
    if (doctors == []) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    res.json({
      doctors,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.searchDoctorByEmail = async (req, res) => {
  console.log(req.query.email);
  try {
    const doctors = await Doctor.find({
      email: { $regex: req.query.email, $options: "i" },
    })
      .populate("specialities")
      .select("name specitialities");
    if (doctors == []) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    res.json({
      doctors,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.addSpeciality = async (req, res) => {
  try {
    const speciality = new Speciality({
      name: req.body.name,
      description: req.body.description,
    });
    const savedSpeciality = await speciality.save();
    res.json({ id: savedSpeciality._id });
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ message: "There was an error adding the speciality." });
  }
};
exports.addSpecialityToDoctor = async (req, res) => {
  try {
    console.log("error.message");
    const doctor = await Doctor.findById(req.body.doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found." });
    }
    console.log(doctor._id);
    const speciality = await Speciality.findById(req.body.specialityId);
    if (!speciality) {
      return res.status(404).json({ message: "Speciality not found." });
    }
    console.log(speciality._id);
    if (doctor.specialities.includes(req.body.specialityId)) {
      return res.status(400).json({ message: "Speciality already exists." });
    }

    doctor.specialities.push(speciality._id);
    await doctor.save();

    res.status(200).json({ message: "Speciality added successfully." });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
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
