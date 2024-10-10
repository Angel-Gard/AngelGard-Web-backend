const express = require('express');
const router = express.Router();
const babyBoardController = require('../controllers/babyboardController');
const multer = require('multer');

// Multer 설정
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}.png`);
    }
});
const upload = multer({ storage: storage }); // 이 부분이 필요합니다.

// 라우트 설정
router.get('/list/:user_login_id', babyBoardController.getbabyboardList);
router.get('/:baby_board_id', babyBoardController.getbabyboard);
router.post('/', upload.single('baby_board_image'), babyBoardController.createbabyboard);
router.put('/:baby_board_id', upload.single('baby_board_image'), babyBoardController.updatebabyboard);
router.delete('/:baby_board_id', babyBoardController.deletebabyboard);

module.exports = router;
