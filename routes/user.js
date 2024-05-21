const express = require('express');
const userController = require('../controller/usercontroller'); // 경로 확인
const authenticateJWT = require('../middlewares/authmiddleware'); // JWT 미들웨어 경로 확인
const router = express.Router();

router.post('/signUp', userController.CsignUp);
router.post('/login', userController.Clogin);
router.get('/info/:id', authenticateJWT, userController.Cinfo);
router.patch('/update', authenticateJWT, userController.Cupdate);
router.delete('/delete', authenticateJWT, userController.Cdelete);

module.exports = router;