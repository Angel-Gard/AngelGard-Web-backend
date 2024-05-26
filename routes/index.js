const express = require("express");
const controller = require("../controllers/indexcontroller"); // 경로 확인
const router = express.Router();

// localhost:3000/
router.get("/", controller.main);
router.get("/login", controller.login);
router.get("/signUp", controller.signUp);
router.get("/profile/:id", controller.profile);

module.exports = router;
