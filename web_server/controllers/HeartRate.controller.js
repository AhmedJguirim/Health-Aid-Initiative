// controllers/heartRateController.js

const HeartRate = require("../schemas/HeartRate.schema");

// Create a new heart rate entry
exports.createHeartRate = async (req, res) => {
  const { value, patientID } = req.body;

  try {
    const newHeartRate = new HeartRate({ value, patientID });
    const savedHeartRate = await newHeartRate.save();

    res.status(201).json(savedHeartRate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all heart rates for a specific patient
exports.getAllHeartRates = async (req, res) => {
  const { patientID } = req.params;

  try {
    const heartRates = await HeartRate.find({ patientID });
    res.json(heartRates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Get all heart rates for a specific patient
exports.doctorGetPatientHeartRate = async (req, res) => {
  const { patientID } = req.params;

  try {
    const heartRates = await HeartRate.find({ patientID });
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
