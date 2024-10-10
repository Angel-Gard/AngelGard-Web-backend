const babyBoardModel = require('../models/babyboard');
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Multer 설정은 그대로 유지

module.exports = {
// 일지 목록 조회
getbabyboardList: async function (req, res, next) {
    try {
        const result = await babyBoardModel.getbabyboardList(req);
        if (result && result.contents.length > 0) {
            result.contents = result.contents.map(item => {
                if (item.baby_board_image && !item.baby_board_image.startsWith('http')) {
                    item.baby_board_image = `http://localhost:3000/uploads/${item.baby_board_image}`; // 'uploads/' 추가
                }
                return item;
            });
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
        const result = await babyBoardModel.getbabyboard(req);
        if (result) {
            if (result.baby_board_image && !result.baby_board_image.startsWith('http')) {
                result.baby_board_image = `http://localhost:3000/uploads/${result.baby_board_image}`; // 'uploads/' 추가
            }
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
        const filePath = req.file ? req.file.filename : null; // 'uploads/'를 제외
        const result = await babyBoardModel.createbabyboard(req, filePath);
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
        const filePath = req.file ? req.file.filename : null; // 'uploads/'를 제외
        const result = await babyBoardModel.updatebabyboard(req, filePath);
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
            const result = await babyBoardModel.deletebabyboard(req);
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
