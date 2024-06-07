const express = require("express");
const babyController = require("../controllers/babyController");
const babyRouter = express.Router();

babyRouter.post("/babycreate", babyController.createBaby);
babyRouter.get("/baby/:user_login_id/:baby_id", babyController.getBabyById);  
babyRouter.get("/baby/:user_login_id", babyController.getAllBabiesByUserId);  
babyRouter.get("/babyupdate/:user_login_id/:baby_id", babyController.updateBaby);
babyRouter.post("/babyupdate/:user_login_id/:baby_id", babyController.updateBabyProcess); 
babyRouter.post("/babydelete/:user_login_id/:baby_id", babyController.deleteBaby); 

module.exports = babyRouter;
