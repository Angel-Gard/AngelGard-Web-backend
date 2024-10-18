const express = require('express');
const { sendNotification } = require('../controllers/notificationController');

const router = express.Router();

// 알림 전송 경로
router.get('/send/:uuid', sendNotification);

module.exports = router;
