const boards = require("../models/board");

module.exports = {
    // 게시글 목록
    selectBoardList: async function (req, res, next) {
        await boards
            .selectBoardList(req)
            .then((result) => {
                res.status(200).json(result);
            })
            .catch((err) => {
                next(err);
            });
    },  
    // 게시글 상세
    selectBoard: async function (req, res, next) {
        await boards
            .selectBoard(req)
            .then((result) => {
                res.status(200).json(result);
            })
            .catch((err) => {
                next(err);
            });
    },
    // 게시글 생성
    createBoard: async function (req, res, next) {
        await boards
            .createBoard(req)
            .then((result) => {
                res.redirect(`/board/${result}`);
            })
            .catch((err) => {
                next(err);
            });
    },
    // 게시글 수정(조회)
    updateBoard: async function (req, res, next) {
        await boards
            .updateBoard(req)
            .then((result) => {
                res.status(200).json(result);
            })
            .catch((err) => {
                next(err);
            });
    },
    // 게시글 수정
    updateBoardProcess: async function (req, res, next) {
        await boards
            .updateBoardProcess(req)
            .then((result) => {
                res.redirect(`/board/${result}`);
            })
            .catch((err) => {
                next(err);
            });
    },
    // 게시글 삭제
    deleteBoard: async function (req, res, next) {
        await boards
            .deleteBoard(req)
            .then((result) => {
                if (result) {
                    res.redirect(`/board`);
                } else {
                    next(err);
                }
            })
            .catch((err) => {
                next(err);
            });
    },
};
