const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middlewares/authmiddleware');
const eatingcontroller = require('../controllers/eatingcontroller'); // 경로 확인

router.post('/babyeating',authenticateJWT,eatingcontroller.Babyeating); //섭취량(수유)
router.post('/pumping',authenticateJWT,eatingcontroller.Pumping); //유축량
router.post('/insertms',authenticateJWT,eatingcontroller.InsertMS); //모유수유 시간
router.get('/selecteat',authenticateJWT,eatingcontroller.SelectEat); //섭취량 조회
router.get('/selectpum',authenticateJWT,eatingcontroller.Selectpum); //유축량 조회
router.get('/selectms',authenticateJWT,eatingcontroller.SelectMS); //모유수유 시간 조회


module.exports = router;

//Babyeating
//Pumping