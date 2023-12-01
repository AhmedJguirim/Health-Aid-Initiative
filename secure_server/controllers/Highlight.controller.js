const Highlight = require("../schemas/Highlight.schema");

// Controller to create a new consent
exports.createHighlight = async (req, res) => {
  try {
    const { patient, doctor } = req.body;
    const high = await Highlight.findOne({ patient, doctor });
    if (high) {
      return res.status(403).json({ error: "patient already highlighted" });
    }
    const consent = await Consent.findOne({ patient, doctor });
    if (!consent) {
      return res.status(401).json({ error: "consent not given" });
    }
    const newHighlight = new Highlight({
      patient,
      doctor,
    });
    await newHighlight.save();
    res.status(201).json({ message: "patient highlighted successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.getHighlightedPatients = async (req, res) => {
  try {
    const highlightedPatients = await Highlight.find({
      doctor: req.query.doctor,
    }).populate("patient", "name patientID phoneNumber");
    s;

    return res.status(200).json({ highlightedPatients: highlightedPatients });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

// Controller to get details of a specific consent
exports.getConsentDetails = async (req, res) => {
  try {
    const consent = await Consent.findById(req.params.consentID)
      .populate("doctor", "name") // Include only necessary doctor fields
      .populate("patient", "name"); // Include only necessary patient fields

    if (!consent) {
      return res.status(404).json({ error: "Consent not found" });
    }

    res.json(consent);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getConsentsOfDoc = async (req, res) => {
  const { doctor } = req.query;
  try {
    const consents = await Consent.find({ doctor: doctor }); // Include only necessary patient fields
    const patientIds = consents.map((consent) => consent.patient);

    // Find patients using the extracted IDs
    const patients = await Patient.find({ _id: { $in: patientIds } });
    const patientInfo = patients.map((patient) => ({
      id: patient._id,
      name: patient.name,
    }));
    res.json(patientInfo);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.getConsentOfdocPatient = async (req, res) => {
  const { doctor, patient } = req.params;
  console.log(req.body);
  try {
    const consent = await Consent.findOne({
      doctor: doctor,
      patient: patient,
    }).populate("patient"); // Include only necessary patient fields
    // Find patients using the extracted IDs
    if (consent == null) {
      return res.status(401).json({ error: "unauthorized" });
    }

    // Access the patient information (assuming it's already populated)
    const patientID = consent.patient ? consent.patient.patientID : null;

    // Check if patientID is null
    if (patientID == null) {
      return res.status(500).json({ error: "Patient ID not found" });
    }
    res.json(patientID);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.getConsentOfdocPatientAdd = async (req, res) => {
  const { doctor, patient } = req.params;
  console.log(req.body);
  try {
    const consent = await Consent.findOne({
      doctor: doctor,
      patient: patient,
      add: true,
    })
      .populate("patient")
      .populate("doctor"); // Include only necessary patient fields
    // Find patients using the extracted IDs
    if (!consent) {
      return res.status(401).json({ error: "unauthorized" });
    }

    // Access the patient information (assuming it's already populated)
    const patientID = consent.patient ? consent.patient.patientID : null;
    const doctorID = consent.doctor ? consent.doctor.doctorID : null;

    // Check if patientID is null
    if (!patientID) {
      return res.status(500).json({ error: "Patient ID not found" });
    }
    res.json({ patientID, doctorID, doctorName: consent.doctor.name });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

// Controller to update details of a specific consent
exports.updateConsentDetails = async (req, res) => {
  try {
    const consent = await Consent.findByIdAndUpdate(
      req.params.consentID,
      req.body,
      { new: true }
    );
    if (!consent) {
      return res.status(404).json({ error: "Consent not found" });
    }
    res.json(consent);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller to delete a specific consent
exports.deleteConsent = async (req, res) => {
  try {
    const card = await Card.findOne({
      code: req.body.code,
      valid: true,
    }).populate("patient");
    console.log(card);
    if (!card) {
      return res.status(400).json({ error: "patient not found" });
    }
    const consent = await Consent.findOneAndDelete({
      patient: card.patient._id,
      doctor: req.params.doctor,
    });
    if (!consent) {
      return res.status(404).json({ error: "Consent not found" });
    }
    res.json({ message: "Consent deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.deleteConsentById = async (req, res) => {
  try {
    const consent = await Consent.findByIdAndRemove(req.params.consentID);
    if (!consent) {
      return res.status(404).json({ error: "Consent not found" });
    }
    res.json({ message: "Consent deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
