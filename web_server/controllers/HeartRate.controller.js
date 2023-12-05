// controllers/heartRateController.js

const { default: axios } = require("axios");
const HeartRate = require("../schemas/HeartRate.schema");
const jwt = require("jsonwebtoken");
const fs = require("fs").promises; // for file reading
const { verifyJwt } = require("../utils/auth");

// Create a new heart rate entry
exports.createHeartRate = async (req, res) => {
  const { value, patientID } = req.body;
  const decodedJwt = await verifyJwt(req.headers.authorization);
  const pID = await axios.get(
    `http://127.0.0.1:3001/api/patients/ID/${decodedJwt.code}`
  );
  if (!pID) {
    return res.status(404).json({ error: "Not found: card not found" });
  }
  try {
    const newHeartRate = new HeartRate({
      value,
      patientID: pID.data.patientID,
    });
    const savedHeartRate = await newHeartRate.save();

    res.status(201).json(savedHeartRate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all heart rates for a specific patient
exports.doctorGetPatientHeartRate = async (req, res) => {
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
          // const heartrates = HeartRate.find({ patientID });
          // Continue processing the request
          console.log(resp.data);
          const resp1 = await HeartRate.find({ patientID: resp.data });

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

exports.patientGetHisHeartRates = async (req, res) => {
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
          // const heartrates = HeartRate.find({ patientID });
          // Continue processing the request
          console.log(resp.data);
          const resp1 = await HeartRate.find({
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

exports.getAllHeartRates = async (req, res) => {
  const { patient } = req.params;

  try {
    const heartRates = await HeartRate.find({ patient });
    res.json(heartRates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific heart rate by ID
exports.getHeartRateById = async (req, res) => {
  const { heartRateId } = req.params;

  try {
    const heartRate = await HeartRate.findById(heartRateId);
    if (!heartRate) {
      return res.status(404).json({ error: "Heart rate not found" });
    }

    res.json(heartRate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a heart rate by ID
exports.updateHeartRate = async (req, res) => {
  const { heartRateId } = req.params;
  const updateFields = req.body;

  try {
    const updatedHeartRate = await HeartRate.findByIdAndUpdate(
      heartRateId,
      updateFields,
      { new: true }
    );

    if (!updatedHeartRate) {
      return res.status(404).json({ error: "Heart rate not found" });
    }

    res.json(updatedHeartRate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a heart rate by ID
exports.deleteHeartRate = async (req, res) => {
  const { heartRateId } = req.params;

  try {
    const deletedHeartRate = await HeartRate.findByIdAndDelete(heartRateId);

    if (!deletedHeartRate) {
      return res.status(404).json({ error: "Heart rate not found" });
    }

    res.json(deletedHeartRate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
