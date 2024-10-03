const express = require('express');
const router = express.Router();
const babyBoardController = require('../controllers/babyboardController');
const multer = require('multer'); // 파일 업로드를 위한 미들웨어
const upload = multer({ dest: 'uploads/' }); // 파일이 업로드될 경로





// 개별 일지 조회
router.get('/:baby_board_id', (req, res, next) => {
    // 로그 추가하여 요청이 들어왔을 때 baby_board_id가 출력되도록 함
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
