const express = require('express');
const router = express.Router();
const schedulerController = require('../controllers/schedulerController');

// 스케줄러 항목 생성
router.post('/:user_login_id', schedulerController.createScheduler);

// 특정 날짜의 스케줄 조회
router.get('/:user_login_id/date/:scheduler_date', schedulerController.getSchedule);

// 특정 월의 스케줄 조회
router.get('/:user_login_id/month/:year/:month', schedulerController.getScheduleByMonth);

// 스케줄러 항목 수정
router.put('/:user_login_id/:scheduler_id', schedulerController.updateScheduler);

// 스케줄러 항목 삭제
router.delete('/:user_login_id/:scheduler_id', schedulerController.deleteScheduler);

module.exports = router;
