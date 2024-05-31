const express = require('express');
const userController = require('../controllers/usercontroller'); // 경로 확인
const authenticateJWT = require('../middlewares/authmiddleware'); // JWT 미들웨어 경로 확인
const router = express.Router();


router.post('/signUp', userController.CsignUp);
router.post('/login', userController.Clogin);
router.post('/mypage/:id', authenticateJWT, userController.getUserDetails);
router.post('/update/:id', authenticateJWT, userController.Cupdate);
router.delete('/delete', authenticateJWT, userController.Cdelete);
router.post('/logout', userController.Clogout);

module.exports = router;
