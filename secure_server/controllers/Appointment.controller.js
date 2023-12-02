const Appointment = require("../schemas/Appointment.schema");
const uuid = require("uuid");
const forge = require("node-forge");
const fs = require("fs").promises; // for file reading

exports.createAppointment = async (req, res) => {
  try {
    // Assuming you have the doctor and patient instances available
    const { doctor, patient, ...appointmentData } = req.body;
    const appointmentID = await generateUniqueAppointmentId();
    const publicKey = await fs.readFile(
      "keys/public_key_webServer.pem",
      "utf8"
    );
    const pbkey = forge.pki.publicKeyFromPem(publicKey);

    const newAppointment = new Appointment({
      doctor: doctor,
      patient: patient,
      ...appointmentData,
      appointmentID: appointmentID,
    });

    await newAppointment.save();
    const IDEnc = pbkey.encrypt(appointmentID);
    res.status(201).json({ appointmentID: IDEnc });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.getAppointmentDetails = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      appointmentID: req.params.appointmentID,
    })
      .populate("doctor")
      .populate("patient");

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    res.json(appointment);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAppointmentsByDoctor = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      doctor: req.params.doctorID,
    }).populate("patient");

    res.json(appointments);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const Patient = require("../schemas/Patient.schema");
const Doctor = require("../schemas/Doctor.schema");
exports.getAppointmentsOfPatientByDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ _id: req.params.doctor });

    const patient = await Patient.findOne({
      patientID: req.params.patientID,
    }).select("-addresses -cards -responsiblePhoneNumber");
    const appointments = await Appointment.find({
      patient: patient._id,
    });
    console.log(patient);
    const publicKey = forge.pki.publicKeyFromPem(doctor.publicKey);
    // const encryptedData = publicKey.encrypt(JSON.stringify(patient));

    // res.json({ appointments, patient: encryptedData });
    res.json({ appointments, patient: patient });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAppointmentsByPatient = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      patient: req.params.patientID,
    }).populate("doctor");

    res.json(appointments);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOneAndUpdate(
      { appointmentID: req.params.appointmentID },
      { $set: req.body },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    res.json(appointment);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOneAndDelete({
      appointmentID: req.params.appointmentID,
    });

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    res.json({ message: "Appointment deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const generateUniqueAppointmentId = async () => {
  let appointmentID;
  do {
    appointmentID = uuid.v4().substring(0, 8); // Adjust the length as needed
  } while (await appointmentIDExists(appointmentID));

  return appointmentID;
};

// Function to check if a appointment ID already exists in the database
const appointmentIDExists = async (appointmentID) => {
  const existingAppointment = await Appointment.findOne({ appointmentID });
  return existingAppointment !== null;
};
