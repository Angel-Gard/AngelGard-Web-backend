const path = require('path');
const multer = require('multer');
const fs = require('fs');
const qimage = require('../models/qimage'); // 쿼리 모델

// Multer 설정 아이디를 가지고 파일이름을 아이디로 하기
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = path.join(__dirname, '../image/profile');
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
        }
        return cb(null, dir);
    },
    filename: function (req, file, cb) {
        const userId = req.params.user_login_id; // URL에서 ID 추출
        const fileExtension = path.extname(file.originalname); // 원본 파일의 확장자 추출
        const filename = userId + fileExtension
        cb(null, filename); // 파일 이름을 ID로 설정하고 원본 확장자 추가
    }
});

// 파일 유형 확인 (이미지 파일만 허용)
const fileFilter = (req, file, cb) => {
    // 허용할 이미지 파일의 MIME 타입
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // 파일 허용
    } else {
        cb(new Error('이미지 파일만 업로드 가능합니다.'), false); // 파일 거부
    }
};


const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter
});

exports.uploadImage = [
    //upload.single('imageFile'),
    upload.any(),
    async (req, res) => {
        if (!req.files) {
            return res.status(407).json({ message: '이미지 파일만 업로드 가능합니다.' });
        }else{
            const file = req.files[0];
            console.log("req : ",file);
            const newInfo = req.body;

            let filePath = '';
            const userId = req.params.user_login_id;
            if (file) {
                filePath = "http://louk342.iptime.org:3000/image/profile/" +file.filename;
                console.log("file Path : ",filePath);
                newInfo["imageFile"] = filePath;
            }
            // 여기에 데이터베이스 저장 로직 추가 가능
            console.log("filepath : ",filePath);
            console.log("userid : ", userId);
            const result = await qimage.imageup({filePath,userId});
            res.status(200).json({result});
        }

        
    }
];

exports.getImageById = async (req, res) => {
    const paramsid = req.params.user_login_id;
    console.log("paramsid : ",paramsid)
    // DB에서 이미지 정보 조회
    const result = await qimage.getimage(paramsid);
    res.send({ result, message: "이미지 정보 반환" });
};

