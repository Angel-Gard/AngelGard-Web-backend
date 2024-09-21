const express = require('express');
const router = express.Router();
const schedulerController = require('../controllers/schedulerController');

// 스케줄러 항목 생성
router.post('/', schedulerController.createScheduler);

// 특정 날짜의 스케줄 조회
router.get('/:scheduler_date', schedulerController.getSchedule);
// 특정 월의 스케줄
router.get('/:year/:month', schedulerController.getScheduleByMonth);

// 스케줄러 항목 수정
router.put('/', schedulerController.updateScheduler);

// 스케줄러 항목 삭제
router.delete('/:scheduler_id', schedulerController.deleteScheduler);


module.exports = router;
