const Notification = require("../schemas/Notification.schema");
const { verifyJwt } = require("../utils/auth");
// Controller to create a new consent
exports.createNotification = async (req, res) => {
  try {
    const decodedJwt = await verifyJwt(req.headers.authorization);
    const { patientID, title, content, trigger } = req.body;
    const newNotification = new Notification({
      patientID,
      doctor: decodedJwt.doctor_id,
      title,
      content,
      trigger,
    });
    await newNotification.save();
    res.status(201).json({ message: "notification created successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const decodedJwt = await verifyJwt(req.headers.authorization);
    const notifications = await Notification.find({
      doctor: decodedJwt.doctor_id,
    });

    return res.status(200).json({ notifications });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};
