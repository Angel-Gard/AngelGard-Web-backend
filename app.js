const express = require('express');
const multer = require('multer');
const path = require('path');
const mime = require('mime-types');
const createError = require('http-errors');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const methodOverride = require('method-override');
const fcm = require('./fcm');

// 라우터 임포트
const testRouter = require("./routes/testRouter");
const boardRouter = require("./routes/boardRouter");
const commentRouter = require("./routes/commentRouter");
const likeRouter = require("./routes/likeRouter");
const babyRouter = require("./routes/babyrouter");
const schedulerRouter = require('./routes/schedulerRouter');
const babyboardRouter = require('./routes/babyboardRouter');
const indexRouter = require("./routes/index");
const userRouter = require("./routes/user");
const imageRouter = require("./routes/image");
const dthRouter = require("./routes/dthmb");
const eatRouter = require("./routes/eating");
const pushRouter = require("./routes/notificationRoutes");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// 미들웨어
app.use(methodOverride("_method"));
app.use(logger("dev"));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// CORS 처리
app.use(cors());
app.use((req, res, next) => {
    const allowedOrigins = ["http://louk342.iptime.org:8080", "http://localhost:3000", "http://34.47.76.73:3000"];
    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
    }
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

// OPTIONS 메서드에 대한 핸들러 추가 (프리플라이트 요청 처리)
app.options("*", (req, res) => {
    res.sendStatus(200);
});

// 이미지 업로드 설정 (multer와 mime-types 사용)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');  // 파일 저장 경로
    },
    filename: function (req, file, cb) {
        // 파일의 확장자를 MIME 타입으로 자동 추가
        const ext = mime.extension(file.mimetype); // MIME 타입에서 확장자 추출
        cb(null, `${file.fieldname}-${Date.now()}.${ext}`);  // 파일 이름 설정
    }
});

const upload = multer({ storage: storage });

// 라우터로 들어오는 모든 요청을 로깅
app.use((req, res, next) => {
    console.log(`Received request: ${req.method} ${req.path}`);
    next();
});

// 라우터 사용
app.use("/", indexRouter);
app.use("/test", testRouter);
app.use("/board", boardRouter);
app.use("/comment", commentRouter);
app.use("/like", likeRouter);
app.use("/mypage", babyRouter);
app.use("/user", userRouter);
app.use("/image", imageRouter);
app.use("/dth", dthRouter);
app.use("/eat", eatRouter);
app.use('/scheduler', schedulerRouter);

// babyboard 라우터로 들어오는 요청 로그 추가
app.use('/babyboard', (req, res, next) => {
    console.log('Routing to babyboard:', req.method, req.url);
    next();
}, babyboardRouter);

// Initialize FCM
fcm.connect().catch(console.error);
app.use('/push', pushRouter);

// 이미지 반환
app.use("/img/thumbnails", express.static("../resource/img/thumbnails"));
app.use("/img", express.static("../resource/img"));

// 업로드된 파일을 정적 파일로 제공할 때 Content-Type 설정
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
    setHeaders: (res, filePath) => {  // 매개변수 이름을 'filePath'로 수정
        // 파일 경로가 문자열인지 확인
        console.log('filePath:', filePath);  // 경로를 로그로 출력

        // 경로가 올바른지 확인 후 처리
        if (typeof filePath === 'string') {
            const ext = path.extname(filePath);  // 파일 확장자 추출
            if (ext === '.jpg' || ext === '.jpeg') {
                res.setHeader('Content-Type', 'image/jpeg');
            } else if (ext === '.png') {
                res.setHeader('Content-Type', 'image/png');
            } else if (ext === '.gif') {
                res.setHeader('Content-Type', 'image/gif');
            } else {
                res.setHeader('Content-Type', 'application/octet-stream');  // 기타 파일은 기본 바이너리 타입으로 설정
            }
        } else {
            console.error('filePath is not a string:', filePath);
        }
    }
}));
// babyboard 파일 업로드 엔드포인트
app.post('/babyboard', (req, res, next) => {
    upload.single('baby_board_image')(req, res, (err) => {
        if (err) {
            console.log("파일 업로드 중 오류 발생:", err);
            return res.status(500).send("파일 업로드 중 오류가 발생했습니다.");
        }
        console.log('===== /babyboard 엔드포인트 호출 =====');
        if (!req.file) {
            console.log("파일이 업로드되지 않았습니다.");
            return res.status(400).send("파일이 업로드되지 않았습니다.");
        }

        // 파일명과 파일 경로 로그 출력
        console.log('===== 파일 업로드 처리 중 =====');
        console.log(`파일 경로: ${req.file.path}`);
        console.log(`파일명: ${req.file.filename}`);

        // 응답 전에 로그가 제대로 찍히는지 확인
        console.log('===== 응답 전 로그 출력 =====');

        res.status(201).json({ 
            message: "일지가 성공적으로 생성되었습니다.",
            baby_board_id: 65  // 예시로 고정 ID를 반환
        });

        console.log('===== 응답 후 로그 출력 =====');
    });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
