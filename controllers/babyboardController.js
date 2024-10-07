const babyBoardModel = require('../models/babyboard');
const multer = require("multer");
const fs = require("fs");
const path = require("path");

//********* 이미지 세팅 ********* */
// Multer 설정: 파일을 'uploads' 폴더에 저장하고, 파일 이름을 순차적으로 설정하며 모든 파일 확장자를 .png로 설정
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');  // 파일 저장 경로 설정
    },
    filename: function (req, file, cb) {
        // 'uploads' 폴더에 있는 파일을 동기적으로 읽고 가장 큰 번호 찾기
        try {
            const files = fs.readdirSync('uploads/');
            // 파일 이름이 숫자로 시작하는지 확인하고 숫자만 추출하여 배열로 만듦
            const numberList = files
                .map(file => {
                    const match = file.match(/^(\d+)\.png$/);  // 숫자.png 패턴 찾기
                    return match ? parseInt(match[1], 10) : null;
                })
                .filter(number => number !== null);  // 숫자만 남기기

            // 현재 가장 큰 번호 찾기
            const nextNumber = numberList.length > 0 ? Math.max(...numberList) + 1 : 1;
            const filename = `${nextNumber}.png`;
            console.log(`저장될 파일 이름: ${filename}`);

            // 파일 이름을 n.png 형식으로 설정
            cb(null, filename);
        } catch (err) {
            cb(err);
        }
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
            const result = await babyBoardModel.getbabyboardList(req);  // res 전달하지 않음
            if (result && result.contents.length > 0) {
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
            console.log("babyboardController.getbabyboard called with ID:", req.params.baby_board_id);
            const result = await babyBoardModel.getbabyboard(req);
            
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
            const filePath = req.file ? req.file.path : null; // 파일 업로드가 있을 경우
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
