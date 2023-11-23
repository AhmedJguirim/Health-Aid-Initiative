const Disease = require("../schemas/Disease.schema");

// Create a new disease
exports.createDisease = async (req, res) => {
  const { name } = req.body;

  try {
    const newDisease = new Disease({ name });
    const savedDisease = await newDisease.save();

    res.status(201).json(savedDisease);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all diseases
exports.getAllDiseases = async (req, res) => {
  try {
    const diseases = await Disease.find();
    res.json(diseases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific disease by name
exports.getDiseaseByName = async (req, res) => {
  const { name } = req.params;

  try {
    const disease = await Disease.findOne({ name });
    if (!disease) {
      return res.status(404).json({ error: "Disease not found" });
    }

    res.json(disease);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a disease by name
exports.updateDisease = async (req, res) => {
  const { name } = req.params;
  const { newName } = req.body;

  try {
    const updatedDisease = await Disease.findOneAndUpdate(
      { name },
      { name: newName },
      { new: true }
    );

    if (!updatedDisease) {
      return res.status(404).json({ error: "Disease not found" });
    }

    res.json(updatedDisease);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a disease by name
exports.deleteDisease = async (req, res) => {
  const { name } = req.params;

  try {
    const deletedDisease = await Disease.findOneAndDelete({ name });

    if (!deletedDisease) {
      return res.status(404).json({ error: "Disease not found" });
    }

    res.json(deletedDisease);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.partialSearch = async (req, res) => {
  try {
    const partialName = req.params.partialName.toLowerCase(); // Convert to lowercase for case-insensitive search

    // Use a regular expression for partial matching
    const regex = new RegExp(partialName, "i");

    // Find diseases that match the partialName
    const results = await Disease.find({ name: { $regex: regex } }).limit(10);

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
