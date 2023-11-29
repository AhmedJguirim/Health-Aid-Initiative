// controllers/bloodPressureController.js

const { default: axios } = require("axios");
const BloodPressure = require("../schemas/BloodPressure.schema");
const jwt = require("jsonwebtoken");
const fs = require("fs").promises; // for file reading
const { verifyJwt } = require("../utils/auth");

// Create a new heart rate entry
exports.createBloodPressure = async (req, res) => {
  const { systolic, diastolic } = req.body;
  const decodedJwt = await verifyJwt(req.headers.authorization);
  const pID = await axios.get(
    `http://127.0.0.1:3001/api/patients/ID/${decodedJwt.code}`
  );
  if (!pID) {
    return res.status(404).json({ error: "Not found: card not found" });
  }
  try {
    const newBloodPressure = new BloodPressure({
      systolic,
      diastolic,
      patientID: pID.data.patientID,
    });
    const savedBloodPressure = await newBloodPressure.save();

    res.status(201).json(savedBloodPressure);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all heart rates for a specific patient
exports.doctorGetPatientBloodPressure = async (req, res) => {
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
          // const heartrates = BloodPressure.find({ patientID });
          // Continue processing the request
          console.log(resp.data);
          const resp1 = await BloodPressure.find({ patientID: resp.data });

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

exports.patientGetHisBloodPressures = async (req, res) => {
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
          // const heartrates = BloodPressure.find({ patientID });
          // Continue processing the request
          console.log(resp.data);
          const resp1 = await BloodPressure.find({
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

exports.getAllBloodPressures = async (req, res) => {
  const { patient } = req.params;

  try {
    const bloodPressures = await BloodPressure.find({ patient });
    res.json(bloodPressures);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific heart rate by ID
exports.getBloodPressureById = async (req, res) => {
  const { bloodPressureId } = req.params;

  try {
    const bloodPressure = await BloodPressure.findById(bloodPressureId);
    if (!bloodPressure) {
      return res.status(404).json({ error: "Heart rate not found" });
    }

    res.json(bloodPressure);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a heart rate by ID
exports.updateBloodPressure = async (req, res) => {
  const { bloodPressureId } = req.params;
  const updateFields = req.body;

  try {
    const updatedBloodPressure = await BloodPressure.findByIdAndUpdate(
      bloodPressureId,
      updateFields,
      { new: true }
    );

    if (!updatedBloodPressure) {
      return res.status(404).json({ error: "Heart rate not found" });
    }

    res.json(updatedBloodPressure);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a heart rate by ID
exports.deleteBloodPressure = async (req, res) => {
  const { bloodPressureId } = req.params;

  try {
    const deletedBloodPressure = await BloodPressure.findByIdAndDelete(
      bloodPressureId
    );

    if (!deletedBloodPressure) {
      return res.status(404).json({ error: "Heart rate not found" });
    }

    res.json(deletedBloodPressure);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
