//sry too burnt out to come up with a name
const { verifyJwt } = require("../utils/auth");
const { default: axios } = require("axios");
const Notification = require("../schemas/Notification.schema");

exports.getHighlightedCards = async (req, res) => {
  try {
    const decodedJwt = await verifyJwt(req.headers.authorization);
    const patients = await axios.get(
      `http://127.0.0.1:3001/api/highlights?doctor=${decodedJwt.doctor_id}`
    );
    const currentDate = new Date().toISOString().split("T")[0];

    for (const patient of patients.data.highlightedPatients) {
      const patientId = patient.patient.patientID;

      const count = await Notification.countDocuments({
        patientID: patientId,
        createdAt: {
          $gte: new Date(currentDate), // Greater than or equal to the start of today
          $lt: new Date(currentDate + "T23:59:59"), // Less than the end of today
        },
      });

      // Add the notificationCount property to the patient object
      patient.notificationCount = count;
    }

    console.log(patients.data.highlightedPatients);
    res.json(patients.data);
  } catch (err) {
    console.error(err.message);
    res.status(401).json({ error: err.message });
  }
};
