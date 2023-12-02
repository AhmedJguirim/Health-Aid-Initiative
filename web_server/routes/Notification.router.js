const express = require("express");
const router = express.Router();
const NotificationController = require("../controllers/Notification.controller");

router.post("/notifications", NotificationController.createNotification);
router.get("/notifications", NotificationController.getNotifications);
router.get(
  "/notifications/unseen",
  NotificationController.getUnseenNotifications
);
router.get(
  "/notifications/todayCount",
  NotificationController.todaysNotificationsCount
);
router.put(
  "/notifications/see/:notification",
  NotificationController.setNotificationAsSeen
);

module.exports = router;
