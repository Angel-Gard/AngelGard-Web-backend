const babyBoardModel = require('../models/babyboard');

module.exports = {

    // 일지 목록 조회
    getbabyboardList: async function (req, res, next) {
        try {
            const result = await babyBoardModel.selectDiaryList(req);
            if (result) {
                res.status(200).json(result);
            } else {
                   res.status(404).json({ message: "일지 목록 조회 실패" });
            }
        } catch (err) {
            next(err);
        }
    },

    // 개별 일지 조회
    getbabyboard: async function (req, res, next) {
        try {
            const result = await babyBoardModel.selectDiary(req);
            if (result) {
                res.status(200).json(result);
            } else {
                res.status(404).json({ message: "해당 일지가 존재하지 않습니다." });
            }
        } catch (err) {
            next(err);
        }
    },

    // 일지 생성
    createbabyboard: async function (req, res, next) {
        try {
            const filePath = req.file ? req.file.path : null; // 파일 업로드가 있을 경우
            const result = await babyBoardModel.createDiary(req, filePath);
            if (result) {
                res.status(201).json({ message: "일지가 성공적으로 생성되었습니다.", baby_board_id: result });
            } else {
                res.status(400).json({ message: "일지 생성 실패" });
            }
        } catch (err) {
            next(err);
        }
    },

    // 일지 수정
    updatebabyboard: async function (req, res, next) {
        try {
            const filePath = req.file ? req.file.path : null; // 파일 업로드가 있을 경우
            const result = await babyBoardModel.updateDiary(req, filePath);
            if (result) {
                res.status(200).json({ message: "일지가 성공적으로 수정되었습니다." });
            } else {
                res.status(400).json({ message: "일지 수정 실패" });
            }
        } catch (err) {
            next(err);
        }
    },

    // 일지 삭제
    deletebabyboard: async function (req, res, next) {
        try {
            const result = await babyBoardModel.deleteDiary(req);
            if (result) {
                res.status(200).json({ message: "일지가 성공적으로 삭제되었습니다." });
            } else {
                res.status(404).json({ message: "일지 삭제 실패" });
            }
        } catch (err) {
            next(err);
        }
    },
};
