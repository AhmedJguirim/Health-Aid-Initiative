// controllers/patientController.js

const Patient = require("../schemas/Patient.schema");
const Card = require("../schemas/Card.schema");
const uuid = require("uuid");
const jwt = require("jsonwebtoken");
const forge = require("node-forge");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const qrcode = require("qrcode");
const Address = require("../schemas/Address.schema");

// Get all patients
exports.getAllPatients = async (req, res) => {
  try {
    res.status(401).json({ error: "forbidden route :)" });
    const patients = await Patient.find();
    const publicKey = forge.pki.publicKeyFromPem(doctor.publicKey);
    res.json(patients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific patient by ID
exports.getPatientByCode = async (req, res) => {
  const { code } = req.params;

  try {
    const card = await Card.findOne({ code: code, valid: true });
    if (!card) {
      return res.status(404).json({ error: "Card not found or invalid" });
    }
    const patient = await Patient.findById(card.patient).populate("addresses");
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }
    const publicKey = forge.pki.publicKeyFromPem(card.publicKey);
    const patientData = {
      name: patient.name,
      birthDate: patient.birthDate,
      phoneNumber: patient.phoneNumber,
      responsiblePhoneNumber: patient.responsiblePhoneNumber,
      bloodType: patient.bloodType,
      sex: patient.sex,
      // ... other patient data
    };
    const encryptedData = publicKey.encrypt(JSON.stringify(patientData));
    const encryptedAdderess = publicKey.encrypt(
      JSON.stringify(patient.addresses[0])
    );
    res.json({ patientData: encryptedData, address: encryptedAdderess });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
};

// Create a new patient
exports.createPatient = async (req, res) => {
  const patientID = await generateUniquePatientId();
  const {
    name,
    birthDate,
    email,
    phoneNumber,
    responsiblePhoneNumber,
    CIN,
    pinCode,
    publicKey,
  } = req.body;

  try {
    const newPatient = new Patient({
      patientID,
      name,
      birthDate,
      email,
      phoneNumber,
      responsiblePhoneNumber,
      CIN,
    });

    const savedPatient = await newPatient.save();
    const resp = await addCard(publicKey, pinCode, patientID);
    res.status(201).json(resp);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
};
exports.createPatientEnc = async (req, res) => {
  const patientID = await generateUniquePatientId();
  const { data, publicKey } = req.body;

  try {
    const privateKey = await fs.readFile("keys/private_key.pem", "utf8");
    const pvkey = forge.pki.privateKeyFromPem(privateKey);
    const patient = pvkey.decrypt(req.body.data);
    patient = JSON.parse(patient);
    const {
      name,
      birthDate,
      email,
      phoneNumber,
      responsiblePhoneNumber,
      CIN,
      pinCode,
      bloodType,
      sex,
    } = data;
    const newPatient = new Patient({
      patientID,
      name,
      birthDate,
      email,
      phoneNumber,
      responsiblePhoneNumber,
      CIN,
      sex,
      bloodType,
    });

    await newPatient.save();
    const resp = await addCard(publicKey, pinCode, patientID);
    res.status(201).json(resp);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.addAddressToPatient = async (req, res) => {
  const { patientID, country, city, street, zipcode } = req.body;

  try {
    const patient = await Patient.findOne({ patientID: patientID });
    if (!patient) {
      return res.status(401).json({ error: "Unautherized" });
    }
    const address = new Address({
      country: country,
      city: city,
      street: street,
      zipcode: zipcode,
      patient: patient._id,
    });
    const savedAddress = await address.save();
    patient.addresses.push(savedAddress._id);
    await patient.save();

    res.json(savedAddress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.updatePatient = async (req, res) => {
  const { patientID } = req.params;
  const updateFields = req.body;

  try {
    const updatedPatient = await Patient.findOneAndUpdate(
      { patientID: patientID },
      updateFields,
      { new: true }
    );

    if (!updatedPatient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    res.json(updatedPatient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Update a patient by ID
exports.updatePatient = async (req, res) => {
  const { patientID } = req.params;
  const updateFields = req.body;

  try {
    const updatedPatient = await Patient.findOneAndUpdate(
      { patientID: patientID },
      updateFields,
      { new: true }
    );

    if (!updatedPatient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    res.json(updatedPatient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a patient by ID
exports.deletePatient = async (req, res) => {
  const { patientID } = req.params;

  try {
    const deletedPatient = await Patient.findOneAndDelete({
      patientID: patientID,
    });

    if (!deletedPatient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    res.json(deletedPatient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//create card
exports.createCardForPatient = async (req, res) => {
  const { patientID } = req.params;
  const { publicKey, pinCode } = req.body;

  const resp = await addCard(publicKey, pinCode, patientID);
  res.status(201).json(resp);
};

async function addCard(publicKey, pinCode, patientID) {
  try {
    const patient = await Patient.findOne({ patientID: patientID });
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    // Generate a random and unique code using uuid
    const code = await generateUniqueCode();
    const newCard = new Card({
      code,
      publicKey,
      pinCode,
      patient: patient._id,
    });
    const savedCard = await newCard.save();
    await patient.save();
    const qrCodeImage = await generateQRCode(savedCard.code);
    return { qrCode: qrCodeImage, code: code };
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
}

async function generateQRCode(data) {
  try {
    // Generate QR code image
    const qrCodeImage = await qrcode.toDataURL(data);
    return qrCodeImage;
  } catch (error) {
    console.error("Error generating QR code:", error.message);
    throw error;
  }
}

// Invalidate a card for a specific patient
exports.invalidateCard = async (req, res) => {
  const { patientID, cardId } = req.params;
  try {
    const patient = await Patient.findById(patientID);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    const card = await Card.findById(cardId);
    if (!card) {
      return res.status(404).json({ error: "Card not found" });
    }

    card.valid = false;
    card.validUntil = new Date();
    await card.save();

    res.json({ message: "Card invalidated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get the last valid card for a specific patient
exports.getLastValidCard = async (req, res) => {
  const { patientID } = req.params;

  try {
    const patient = await Patient.findOne(patientID);
    const card = await Card.findOne({ patient: patient._id, valid: true })
      .sort({ createdAt: -1 })
      .limit(1);

    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    res.json(card);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.checkCardValidity = async (req, res) => {
  const { code, pinCode } = req.body;
  try {
    const card = await Card.findOne({ code, pinCode, valid: true }).populate(
      "patient"
    );
    if (!card || !card.patient) {
      return res.status(401).json({ error: "Invalid code or pinCode" });
    }

    // Assuming patientData is an example object, replace it with the actual patient data
    const patientData = {
      name: card.patient.name,
      birthDate: card.patient.birthDate,
      phoneNumber: card.patient.phoneNumber,
      responsiblePhoneNumber: card.patient.responsiblePhoneNumber,
      // ... other patient data
    };
    // const privateKeyJWT = fs.readFileSync("./keys/private_key.pem", "utf8");
    // const publicKeyJWT = fs.readFileSync("./keys/public_key.pem", "utf8");

    // Encrypt patient data with the card's public key
    const publicKey = forge.pki.publicKeyFromPem(card.publicKey);
    const encryptedData = publicKey.encrypt(JSON.stringify(patientData));
    // Patient;
    // const prk = forge.pki.privateKeyFromPem(privateKeyJWT);
    // const decryptedData = JSON.parse(prk.decrypt(encryptedData));

    // Generate JWT tokens

    // res.json({ accessToken, refreshToken, encryptedData, decryptedData });
    res.json({ encryptedData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const generateUniquePatientId = async () => {
  let patientID;
  do {
    patientID = uuid.v4().substring(0, 8); // Adjust the length as needed
  } while (await patientIDExists(patientID));

  return patientID;
};

// Function to check if a patient ID already exists in the database
const patientIDExists = async (patientID) => {
  const existingPatient = await Patient.findOne({ patientID });
  return existingPatient !== null;
};

// Function to check if a code already exists in the database
const codeExists = async (code) => {
  const existingCard = await Card.findOne({ code });
  return existingCard !== null;
};

// Function to generate a unique code using uuid
const generateUniqueCode = async () => {
  let code;
  do {
    code = uuid.v4().substring(0, 8); // Adjust the length as needed
  } while (await codeExists(code));

  return code;
};

exports.getPatientIDByCode = async (req, res) => {
  const { code } = req.params;
  try {
    const card = await Card.findOne({ code: code, valid: true });
    if (!card) {
      return res.status(404).json({ error: "Card not found or invalid" });
    }
    const patient = await Patient.findById(card.patient);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }
    res.json({ patientID: patient.patientID });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
