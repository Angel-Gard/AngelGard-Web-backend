const express = require("express");
const router = express.Router();
const boards = require("../models/board");
const comments = require("../models/comment");
const babys=require("../models/baby");


/* GET home page. */
router.get("/", function (req, res, next) {
    res.render("index", { title: "Express" });
});

// testRouter

// board test
router.get("/write", function (req, res, next) {
    var html = `
    <html>
    <form action="/board/write" method="post">
    <label for="user_id">User ID:</label>
    <input type="hidden" id="user_id" name="user_id" value="1"><br><br>
    <label for="board_title">Board Title:</label>
    <input type="text" id="board_title" name="board_title" value="My Board"><br><br>
    <label for="board_content">Board Content:</label><br>
    <textarea id="board_content" name="board_content">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</textarea><br><br>
    <input type="submit" value="Submit">
</form></html>`;
    res.send(html);
});


router.get("/update/:board_id", function (req, res, next) {
    boards.updateBoard(req).then((result) => {
        const data = result[0];
        const html = `
        <html>
        <form action="/board/update/${req.params.board_id}?_method=PUT" method="post">
        <label for="board_title">Board Title:</label>
        <input type="text" id="board_title" name="board_title" value="${data.board_title}"><br><br>
        <label for="board_content">Board Content:</label><br>
        <textarea id="board_content" name="board_content">${data.board_content}</textarea><br><br>
        <input type="submit" value="Submit">
        </form></html>`;
        res.send(html);
    });
});

router.get("/delete/:board_id", function (req, res, next) {
    var html = `
    <html>
    <form action="/board/${req.params.board_id}?_method=DELETE" method="POST">
    <input type="submit" value="Submit">
    </form></html>`;
    res.send(html);
});

// comment test

router.get("/comment/write/:board_id", function (req, res, next) {
    var html = `
    <html>
    <form action="/comment/write" method="post">
        <input type="hidden" id="user_id" name="user_id" value="1"><br><br>
        <input type="hidden" id="board_id" name="board_id" value="${req.params.board_id}"><br><br>
        <label for="comment_content">Comment Content:</label><br>
        <textarea id="comment_content" name="comment_content">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</textarea><br><br>
        <input type="submit" value="Submit">
    </form></html>`;
    res.send(html);
});

router.get("/comment/update/:comment_id", function (req, res, next) {
    comments.updateComment(req).then((result) => {
        const data = result[0];
        const html = `
        <html>
        <form action="/comment/update/${req.params.comment_id}?_method=PUT" method="post">
            <label for="comment_content">Comment Content:</label><br>
            <textarea id="comment_content" name="comment_content">${data.comment_content}</textarea><br><br>
            <input type="submit" value="Submit">
        </form></html>`;
        res.send(html);
    });
});

router.get("/comment/delete/:comment_id", function (req, res, next) {
    var html = `
    <html>
        <form action="/comment/${req.params.comment_id}?_method=DELETE" method="POST">
        <input type="submit" value="Submit">
    </form></html>`;
    res.send(html);
});

router.get("/create", function (req, res, next) {
    var html = `
        <html>
            <form action="baby/create" method="post">
            <label for="user_id">User ID:</label>
            <input type="text" id="user_id" name="user_id"><br><br>
            
                <label for="baby_name">아이 이름:</label>
                <input type="text" id="baby_name" name="baby_name"><br><br>
                
                <label for="baby_birth">생년월일:</label>
                <input type="date" id="baby_birth" name="baby_birth"><br><br>
                
                <label for="baby_sex">성별:</label>
                <input type="radio" id="male" name="baby_sex" value="남자">
                <label for="male">남자</label>
                <input type="radio" id="female" name="baby_sex" value="여자">
                <label for="female">여자</label><br><br>
                
                <label for="baby_height">키:</label>
                <input type="number" id="baby_height" name="baby_height"><br><br>
                
                <label for="baby_weight">몸무게:</label>
                <input type="number" id="baby_weight" name="baby_weight"><br><br>
                
                <input type="submit" value="제출">
            </form>
        </html>`;
    res.send(html);
});

router.get("/update/:user_id/:baby_id", function (req, res, next) {
  var html = `
      <html>
          <form action="/baby/update/${req.params.user_id}/${req.params.baby_id}" method="post">
              <label for="baby_name">아이 이름:</label>
              <input type="text" id="baby_name" name="baby_name"><br><br>
              <label for="baby_birth">생년월일:</label>
              <input type="date" id="baby_birth" name="baby_birth"><br><br>
              <label for="baby_sex">성별:</label>
              <input type="radio" id="male" name="baby_sex" value="남자">
              <label for="male">남자</label>
              <input type="radio" id="female" name="baby_sex" value="여자">
              <label for="female">여자</label><br><br>
              <label for="baby_height">키:</label>
              <input type="number" id="baby_height" name="baby_height"><br><br>
              <label for="baby_weight">몸무게:</label>
              <input type="number" id="baby_weight" name="baby_weight"><br><br>
              <input type="submit" value="업데이트">
          </form>
      </html>`;
  res.send(html);
});

router.get("/delete/:user_id/:baby_id", function (req, res, next) {
  var html = `
      <html>
          <form action="/baby/delete/${req.params.user_id}/${req.params.baby_id}" method="post">
              <input type="submit" value="삭제">
          </form>
      </html>`;
  res.send(html);
});

module.exports = router;
