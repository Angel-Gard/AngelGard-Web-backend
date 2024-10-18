const express = require('express');
const { sendNotification } = require('../controllers/notificationController');

const router = express.Router();

// 알림 전송 경로
//router.get('/send/:uuid', sendNotification);
router.get('/send/:user_login_id', sendNotification);

module.exports = router;
