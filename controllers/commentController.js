const comments = require("../models/comment");

module.exports = {
    // 댓글 목록
    selectComments: async function (req, res, next) {
        await comments
            .selectComments(req)
            .then((result) => {
                if (result) {
                    res.status(200).json(result);
                } else {
                    res.status(404).json({ message: "댓글 조회 실패" });
                }
            })
            .catch((err) => {
                next(err);
            });
    },
    // 댓글 생성
    createComment: async function (req, res, next) {
        await comments
            .createComment(req)
            .then((result) => {
                if (result) {
                    if (result === "a") {
                        return res.status(400).json({ message: "댓글 내용을 입력해주세요.", success: false });
                    } else {
                        res.status(200).json({ message: "댓글 생성 완료", success: true });
                    }
                } else {
                    res.status(404).json({ message: "댓글 생성 실패", success: false });
                }
            })
            .catch((err) => {
                next(err);
            });
    },
    // 댓글 수정(조회)
    updateComment: async function (req, res, next) {
        await comments
            .updateComment(req)
            .then((result) => {
                if (result) {
                    res.status(200).json(result);
                } else {
                    res.status(404).json({ message: "수정할 댓글 조회 실패" });
                }
            })
            .catch((err) => {
                next(err);
            });
    },
    // 댓글 수정
    updateCommentProcess: async function (req, res, next) {
        await comments
            .updateCommentProcess(req)
            .then((result) => {
                if (result) {
                    res.status(200).json({ message: "댓글 수정 완료", success: true });
                } else {
                    res.status(404).json({ message: "댓글 수정 실패", success: false });
                }
            })
            .catch((err) => {
                next(err);
            });
    },
    // 댓글 삭제
    deleteComment: async function (req, res, next) {
        await comments
            .deleteComment(req)
            .then((result) => {
                if (result) {
                    res.status(200).json({ message: "댓글 삭제 완료", success: true });
                } else {
                    res.status(404).json({ message: "댓글 삭제 실패", success: false });
                }
            })
            .catch((err) => {
                next(err);
            });
    },
};
