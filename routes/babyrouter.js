const express = require("express");
const babyController = require("../controllers/babyController");
const babyRouter = express.Router();

babyRouter.post("/babycreate", babyController.createBaby);
babyRouter.get("/baby/:user_id/:baby_id", babyController.getBabyById);  // id의 baby_id 의값만 받아옴
babyRouter.get("/baby/:user_id", babyController.getAllBabiesByUserId);   //그 아이디값의 baby정보들을 다받아옴
babyRouter.get("/babyupdate/:user_id/:baby_id", babyController.updateBaby); 
babyRouter.post("/babyupdate/:user_id/:baby_id", babyController.updateBabyProcess);
babyRouter.post("/babydelete/:user_id/:baby_id", babyController.deleteBaby);

module.exports = babyRouter;
