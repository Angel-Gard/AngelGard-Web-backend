const express = require("express");
const babyController = require("../Controllers/babyController");
const babyRouter = express.Router();

babyRouter.post("/create", babyController.createBaby);
babyRouter.get("/update/:user_id/:baby_id", babyController.updateBaby); 
babyRouter.post("/update/:user_id/:baby_id", babyController.updateBabyProcess);
babyRouter.post("/delete/:user_id/:baby_id", babyController.deleteBaby); 

module.exports = babyRouter;
