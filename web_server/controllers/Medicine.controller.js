const Medicine = require("../schemas/Medicine.schema");

// Create a new medicine
exports.createMedicine = async (req, res) => {
  const { name } = req.body;

  try {
    const newMedicine = new Medicine({ name });
    const savedMedicine = await newMedicine.save();

    res.status(201).json(savedMedicine);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all medicines
exports.getAllMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find();
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific medicine by name
exports.getMedicineByName = async (req, res) => {
  const { name } = req.params;

  try {
    const medicine = await Medicine.findOne({ name });
    if (!medicine) {
      return res.status(404).json({ error: "Medicine not found" });
    }

    res.json(medicine);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a medicine by name
exports.updateMedicine = async (req, res) => {
  const { name } = req.params;
  const { newName } = req.body;

  try {
    const updatedMedicine = await Medicine.findOneAndUpdate(
      { name },
      { name: newName },
      { new: true }
    );

    if (!updatedMedicine) {
      return res.status(404).json({ error: "Medicine not found" });
    }

    res.json(updatedMedicine);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a medicine by name
exports.deleteMedicine = async (req, res) => {
  const { name } = req.params;

  try {
    const deletedMedicine = await Medicine.findOneAndDelete({ name });

    if (!deletedMedicine) {
      return res.status(404).json({ error: "Medicine not found" });
    }

    res.json(deletedMedicine);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.partialSearch = async (req, res) => {
  try {
    const partialName = req.params.partialName.toLowerCase(); // Convert to lowercase for case-insensitive search

    // Use a regular expression for partial matching
    const regex = new RegExp(partialName, "i");

    // Find medicines that match the partialName
    const results = await Medicine.find({ name: { $regex: regex } }).limit(10);

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
