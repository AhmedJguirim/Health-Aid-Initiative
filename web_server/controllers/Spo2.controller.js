// controllers/spo2Controller.js

const { default: axios } = require("axios");
const Spo2 = require("../schemas/Spo2.schema");
const jwt = require("jsonwebtoken");
const fs = require("fs").promises; // for file reading
const { verifyJwt } = require("../utils/auth");

// Create a new heart rate entry
exports.createSpo2 = async (req, res) => {
  const { value, patientID } = req.body;
  const decodedJwt = await verifyJwt(req.headers.authorization);
  const pID = await axios.get(
    `http://127.0.0.1:3001/api/patients/ID/${decodedJwt.code}`
  );
  if (!pID) {
    return res.status(404).json({ error: "Not found: card not found" });
  }
  try {
    const newSpo2 = new Spo2({
      value,
      patientID: pID.data.patientID,
    });
    const savedSpo2 = await newSpo2.save();

    res.status(201).json(savedSpo2);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all heart rates for a specific patient
exports.doctorGetPatientSpo2 = async (req, res) => {
  const { patient } = req.params;

  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      // Handle the case where the JWT is not present in the headers
      res.status(401).json({ error: "Unauthorized - JWT missing" });
    }
    // Extract the JWT token from the Authorization header
    const token = authorizationHeader.replace("Bearer ", "");
    const privateKey = await fs.readFile("keys/private_key.pem", "utf8");
    jwt.verify(token, privateKey, async (err, decoded) => {
      try {
        if (err) {
          // Handle the case where the JWT verification fails
          res.status(401).json({ error: err.message });
        } else {
          console.log("patient:" + decoded.doctor_id);
          const resp = await axios.get(
            `http://127.0.0.1:3001/api/consents/doctorPatient/${decoded.doctor_id}/${patient}`
          );
          if (!resp.data) {
            res.status(401).json({ error: "Unauthorized" });
          }
          // const heartrates = Spo2.find({ patientID });
          // Continue processing the request
          console.log(resp.data);
          const resp1 = await Spo2.find({ patientID: resp.data });

          res.json(resp1);
        }
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.patientGetHisSpo2s = async (req, res) => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      // Handle the case where the JWT is not present in the headers
      res.status(401).json({ error: "Unauthorized - JWT missing" });
    }
    // Extract the JWT token from the Authorization header
    const token = authorizationHeader.replace("Bearer ", "");
    const privateKey = await fs.readFile("keys/private_key.pem", "utf8");
    jwt.verify(token, privateKey, async (err, decoded) => {
      try {
        if (err) {
          // Handle the case where the JWT verification fails
          res.status(401).json({ error: err.message });
        } else {
          console.log(decoded.code);
          const resp = await axios.get(
            `http://127.0.0.1:3001/api/patients/ID/${decoded.code}`
          );
          if (!resp.data) {
            res.status(401).json({ error: "Unauthorized" });
          }
          // const heartrates = Spo2.find({ patientID });
          // Continue processing the request
          console.log(resp.data);
          const resp1 = await Spo2.find({
            patientID: resp.data.patientID,
          });

          res.json(resp1);
        }
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllSpo2s = async (req, res) => {
  const { patient } = req.params;

  try {
    const spo2s = await Spo2.find({ patient });
    res.json(spo2s);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific heart rate by ID
exports.getSpo2ById = async (req, res) => {
  const { spo2Id } = req.params;

  try {
    const spo2 = await Spo2.findById(spo2Id);
    if (!spo2) {
      return res.status(404).json({ error: "Heart rate not found" });
    }

    res.json(spo2);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a heart rate by ID
exports.updateSpo2 = async (req, res) => {
  const { spo2Id } = req.params;
  const updateFields = req.body;

  try {
    const updatedSpo2 = await Spo2.findByIdAndUpdate(spo2Id, updateFields, {
      new: true,
    });

    if (!updatedSpo2) {
      return res.status(404).json({ error: "Heart rate not found" });
    }

    res.json(updatedSpo2);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a heart rate by ID
exports.deleteSpo2 = async (req, res) => {
  const { spo2Id } = req.params;

  try {
    const deletedSpo2 = await Spo2.findByIdAndDelete(spo2Id);

    if (!deletedSpo2) {
      return res.status(404).json({ error: "Heart rate not found" });
    }

    res.json(deletedSpo2);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
