const boards = require("../models/board");

module.exports = {
    // 게시글 목록
    selectBoardList: async function (req, res, next) {
        await boards
            .selectBoardList(req)
            .then((result) => {
                if (result) {
                    res.status(200).json(result);
                } else {
                    res.status(404).json({ message: "게시글 목록 조회 실패" });
                }
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
                if (result) {
                    res.status(200).json(result);
                } else {
                    res.status(404).json({ message: "게시글 조회 실패" });
                }
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
                if (result) {
                    res.status(200).json({ board_id: result, message: "게시글 생성 완료" });
                } else {
                    res.status(404).json({ message: "게시글 생성 실패" });
                }
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
                if (result) {
                    res.status(200).json(result);
                } else {
                    res.status(404).json({ message: "수정할 게시글 조회 실패" });
                }
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
                if (result) {
                    res.status(200).json({ message: "게시글 수정 완료" });
                } else {
                    res.status(404).json({ message: "게시글 수정 실패" });
                }
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
                    res.status(200).json({ message: "게시글 삭제 완료" });
                } else {
                    res.status(404).json({ message: "게시글 삭제 실패" });
                }
            })
            .catch((err) => {
                next(err);
            });
    },
};
