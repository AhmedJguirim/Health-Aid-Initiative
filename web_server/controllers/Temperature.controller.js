// controllers/temperatureController.js

const { default: axios } = require("axios");
const Temperature = require("../schemas/Temperature.schema");
const jwt = require("jsonwebtoken");
const fs = require("fs").promises; // for file reading
const { verifyJwt } = require("../utils/auth");

// Create a new heart rate entry
exports.createTemperature = async (req, res) => {
  const { value, patientID } = req.body;
  const decodedJwt = await verifyJwt(req.headers.authorization);
  const pID = await axios.get(
    `http://127.0.0.1:3001/api/patients/ID/${decodedJwt.code}`
  );
  if (!pID) {
    return res.status(404).json({ error: "Not found: card not found" });
  }
  try {
    const newTemperature = new Temperature({
      value,
      patientID: pID.data.patientID,
    });
    const savedTemperature = await newTemperature.save();

    res.status(201).json(savedTemperature);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all heart rates for a specific patient
exports.doctorGetPatientTemperature = async (req, res) => {
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
          // const heartrates = Temperature.find({ patientID });
          // Continue processing the request
          console.log(resp.data);
          const resp1 = await Temperature.find({ patientID: resp.data });

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

exports.patientGetHisTemperatures = async (req, res) => {
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
          // const heartrates = Temperature.find({ patientID });
          // Continue processing the request
          console.log(resp.data);
          const resp1 = await Temperature.find({
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

exports.getAllTemperatures = async (req, res) => {
  const { patient } = req.params;

  try {
    const temperatures = await Temperature.find({ patient });
    res.json(temperatures);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific heart rate by ID
exports.getTemperatureById = async (req, res) => {
  const { temperatureId } = req.params;

  try {
    const temperature = await Temperature.findById(temperatureId);
    if (!temperature) {
      return res.status(404).json({ error: "Heart rate not found" });
    }

    res.json(temperature);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a heart rate by ID
exports.updateTemperature = async (req, res) => {
  const { temperatureId } = req.params;
  const updateFields = req.body;

  try {
    const updatedTemperature = await Temperature.findByIdAndUpdate(
      temperatureId,
      updateFields,
      { new: true }
    );

    if (!updatedTemperature) {
      return res.status(404).json({ error: "Heart rate not found" });
    }

    res.json(updatedTemperature);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a heart rate by ID
exports.deleteTemperature = async (req, res) => {
  const { temperatureId } = req.params;

  try {
    const deletedTemperature = await Temperature.findByIdAndDelete(
      temperatureId
    );

    if (!deletedTemperature) {
      return res.status(404).json({ error: "Heart rate not found" });
    }

    res.json(deletedTemperature);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
