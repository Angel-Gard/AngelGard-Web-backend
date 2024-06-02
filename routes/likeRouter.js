const express = require("express");
const likeController = require("../controllers/likeController");
const likeRouter = express.Router();

likeRouter.post("/:board_id", likeController.selectLike);
likeRouter.post("/toggle/:board_id", likeController.setLike);

module.exports = likeRouter;
