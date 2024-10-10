const babyBoardModel = require('../models/babyboard');
const multer = require("multer");
const fs = require("fs");
const path = require("path");

//********* 이미지 세팅 ********* */
// Multer 설정: 파일을 'uploads' 폴더에 저장하고, 파일 이름을 고유하게 설정하여 중복 방지
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');  // 파일 저장 경로 설정
    },
    filename: function (req, file, cb) {
        // 고유한 파일 이름 생성: 타임스탬프와 랜덤 숫자를 조합
        const filename = `${Date.now()}_${Math.floor(Math.random() * 1000)}.png`;
        console.log(`저장될 파일 이름: ${filename}`);

        // 파일 이름을 고유하게 설정
        cb(null, filename);
    }
});

// 파일 유형 확인 (이미지 파일만 허용)
const fileFilter = (req, file, cb) => {
    if (!file) {
        cb(null, true);
    } else {
        // 허용할 이미지 파일의 MIME 타입
        const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
        console.log(`파일의 MIME 타입: ${file.mimetype}`);
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true); // 파일 허용
        } else {
            cb(new Error("이미지 파일만 업로드 가능합니다."), false); // 파일 거부
        }
    }
};

// Multer 미들웨어 설정
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
});

module.exports = {
    upload,  // multer 설정을 export하여 라우터에서 사용 가능하도록 함

    // 일지 목록 조회
    getbabyboardList: async function (req, res, next) {
        try {
            const result = await babyBoardModel.getbabyboardList(req);
            if (result && result.contents.length > 0) {
                // 이미지 경로를 서버 주소와 합쳐서 설정
                result.contents = result.contents.map(item => {
                    if (item.baby_board_image && !item.baby_board_image.startsWith('http')) {
                        item.baby_board_image = `http://localhost:3000/uploads/${item.baby_board_image}`;
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
                // 이미지 경로를 서버 주소와 합쳐서 설정
                if (result.baby_board_image && !result.baby_board_image.startsWith('http')) {
                    result.baby_board_image = `http://localhost:3000/uploads/${result.baby_board_image}`;
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
            const filePath = req.file ? req.file.filename : null; // 파일 이름만 저장
            console.log(`업로드된 파일 경로: ${filePath}`);
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
            const filePath = req.file ? req.file.filename : null; // 파일 이름만 저장
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
