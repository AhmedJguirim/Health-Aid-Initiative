const express = require("express");
const router = express.Router();
const NotificationController = require("../controllers/Notification.controller");

router.post("/notifications", NotificationController.createNotification);
router.get("/notifications", NotificationController.getNotifications);

module.exports = router;
