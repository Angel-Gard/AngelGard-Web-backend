const express = require('express');
const router = express.Router();
const babyBoardController = require('../controllers/babyboardController');

// babyboardController에서 정의한 multer 설정 사용
const upload = require('../controllers/babyboardController').upload; // 컨트롤러에서 설정한 multer 가져오기

// 일지 목록 조회
router.get('/list/:user_login_id', (req, res, next) => {
    console.log(`Received request for user_login_id: ${req.params.user_login_id}`);
    next();
}, babyBoardController.getbabyboardList);

// 개별 일지 조회
router.get('/:baby_board_id', (req, res, next) => {
    console.log(`Received request to get babyboard with ID: ${req.params.baby_board_id}`);
    next();
}, babyBoardController.getbabyboard);

// 일지 생성
router.post('/', upload.single('baby_board_image'), babyBoardController.createbabyboard);

// 일지 수정
router.put('/:baby_board_id', upload.single('baby_board_image'), babyBoardController.updatebabyboard);

// 일지 삭제
router.delete('/:baby_board_id', babyBoardController.deletebabyboard);

module.exports = router;
