const Notification = require("../schemas/Notification.schema");
const { verifyJwt } = require("../utils/auth");
// Controller to create a new consent
exports.createNotification = async (req, res) => {
  try {
    const decodedJwt = await verifyJwt(req.headers.authorization);
    const { patientID, title, content, trigger, criticality } = req.body;
    const newNotification = new Notification({
      patientID,
      doctor: decodedJwt.doctor_id,
      title,
      content,
      trigger,
      criticality,
    });
    const savedNotification = await newNotification.save();
    if (!savedNotification) {
      res.status(500).json({ message: mochkol });
    }
    res.status(201).json(newNotification);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.setNotificationAsSeen = async (req, res) => {
  try {
    const { notification } = req.params;
    const updated = await Notification.findByIdAndUpdate(notification, {
      seen: true,
    });
    if (!updated) {
      res.status(500).json({ message: "error" });
    }

    return res.status(200).json({ message: "notification seen" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};
exports.getNotifications = async (req, res) => {
  try {
    const decodedJwt = await verifyJwt(req.headers.authorization);
    const notifications = await Notification.find({
      doctor: decodedJwt.doctor_id,
    }).sort({ createdAt: -1 });
    notifications.forEach(async (notification) => {
      notification.seen = true;
      await notification.save();
    });

    return res.status(200).json({ notifications });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};
exports.getUnseenNotifications = async (req, res) => {
  try {
    const decodedJwt = await verifyJwt(req.headers.authorization);
    const notifications = await Notification.find({
      doctor: decodedJwt.doctor_id,
      seen: false,
    }).sort({ createdAt: -1 });
    notifications.forEach(async (notification) => {
      notification.seen = true;
      await notification.save();
    });

    return res.status(200).json({ notifications });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};
exports.todaysNotificationsCount = async (req, res) => {
  try {
    const decodedJwt = await verifyJwt(req.headers.authorization);
    const currentDate = new Date().toISOString().split("T")[0];
    const notifications = await Notification.countDocuments({
      doctor: decodedJwt.doctor_id,
      createdAt: {
        $gte: new Date(currentDate), // Greater than or equal to the start of today
        $lt: new Date(currentDate + "T23:59:59"), // Less than the end of today
      },
    });

    return res.status(200).json({ notifications });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};
exports.notificationCountOfPastWeek = async (req, res) => {
  try {
    const decodedJwt = await verifyJwt(req.headers.authorization);
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];

    const notificationCounts = [];
    const currentDate = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setDate(currentDate.getDate() - i);

      const count = await Notification.countDocuments({
        doctor: decodedJwt.doctor_id,
        patientID: req.query.patient,
        createdAt: {
          $gte: new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate() - 1
          ).toISOString(),
          $lt: date.toISOString(),
        },
      });

      notificationCounts.push({
        date: daysOfWeek[date.getDay()],
        count: count,
      });
    }

    return res.status(200).json(notificationCounts);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};
exports.notificationCountOfPastMonth = async (req, res) => {
  try {
    const decodedJwt = await verifyJwt(req.headers.authorization);

    const notificationCounts = [];
    const currentDate = new Date();

    for (let i = 29; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setDate(currentDate.getDate() - i);

      const count = await Notification.countDocuments({
        doctor: decodedJwt.doctor_id,
        patientID: req.query.patient,
        createdAt: {
          $gte: new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate() - 1
          ).toISOString(),
          $lt: date.toISOString(),
        },
      });
      const tempDate = date.toISOString().split("T")[0];
      notificationCounts.push({
        date: tempDate.split("-")[2] + "-" + tempDate.split("-")[1],
        count: count,
      });
    }

    return res.status(200).json(notificationCounts);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};
exports.notificationCountOfPastDay = async (req, res) => {
  try {
    const decodedJwt = await verifyJwt(req.headers.authorization);

    const notificationCounts = [];
    const currentDate = new Date();

    for (let i = 0; i < 24; i++) {
      const date = new Date(currentDate);
      date.setHours(currentDate.getHours() - i);

      const count = await Notification.countDocuments({
        doctor: decodedJwt.doctor_id,
        patientID: req.query.patient,
        createdAt: {
          $gte: date.toISOString(),
          $lt: new Date(date.getTime() + 1 * 60 * 60 * 1000).toISOString(), // Add 1 hour to the current date
        },
      });

      notificationCounts.push({
        hour: date.getHours(),
        count: count,
      });
    }

    return res.status(200).json(notificationCounts);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};
