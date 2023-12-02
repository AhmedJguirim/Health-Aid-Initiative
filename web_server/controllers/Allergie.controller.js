const Allergie = require("../schemas/Allergie.schema");

// Create a new allergie
exports.createAllergie = async (req, res) => {
  // ... create and save the allergie here ...
  const { name } = req.body;

  try {
    const newAllergie = new Allergie({ name });
    const savedAllergie = await newAllergie.save();

    res.status(201).json(savedAllergie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all allergies
exports.getAllAllergies = async (req, res) => {
  try {
    // ... retrieve all allergies from the database here ...
    const allergies = await Allergie.find();
    res.json(allergies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific allergie by name
exports.getAllergieByName = async (req, res) => {
  const { name } = req.params;
  // ... retrieve the allergie from the database by its name here ...

  try {
    const allergie = await Allergie.findOne({ name });
    if (!allergie) {
      return res.status(404).json({ error: "Allergie not found" });
    }

    res.json(allergie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a allergie by name
exports.updateAllergie = async (req, res) => {
  // ... update the allergie in the database by its name here ...

  const { name } = req.params;
  const { newName } = req.body;

  try {
    const updatedAllergie = await Allergie.findOneAndUpdate(
      { name },
      { name: newName },
      { new: true }
    );

    if (!updatedAllergie) {
      return res.status(404).json({ error: "Allergie not found" });
    }

    res.json(updatedAllergie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a allergie by name
exports.deleteAllergie = async (req, res) => {
  const { name } = req.params;
  // ... delete the allergie from the database by its name here ...

  try {
    const deletedAllergie = await Allergie.findOneAndDelete({ name });

    if (!deletedAllergie) {
      return res.status(404).json({ error: "Allergie not found" });
    }

    res.json(deletedAllergie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.partialSearch = async (req, res) => {
  try {
    // ... perform a partial search on the allergies in the database here ...

    const partialName = req.params.partialName.toLowerCase(); // Convert to lowercase for case-insensitive search

    // Use a regular expression for partial matching
    const regex = new RegExp(partialName, "i");

    // Find allergies that match the partialName
    const results = await Allergie.find({ name: { $regex: regex } }).limit(10);

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
