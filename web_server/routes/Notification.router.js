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
router.get(
  "/notifications/pastWeekCount",
  NotificationController.notificationCountOfPastWeek
);
router.get(
  "/notifications/pastMonthCount",
  NotificationController.notificationCountOfPastMonth
);
router.get(
  "/notifications/pastDayCount",
  NotificationController.notificationCountOfPastDay
);
router.put(
  "/notifications/see/:notification",
  NotificationController.setNotificationAsSeen
);

module.exports = router;
