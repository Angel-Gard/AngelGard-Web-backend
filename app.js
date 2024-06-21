const createError = require("http-errors");
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const methodOverride = require("method-override");

// 라우터 임포트
const testRouter = require("./routes/testRouter");
const boardRouter = require("./routes/boardRouter");
const commentRouter = require("./routes/commentRouter");
const likeRouter = require("./routes/likeRouter");
const babyRouter = require("./routes/babyrouter");

const indexRouter = require("./routes/index");
const userRouter = require("./routes/user");
const imageRouter = require("./routes/image");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// 미들웨어
app.use(methodOverride("_method"));
app.use(logger("dev"));
app.use(express.json({ limit: "1mb" })); // 413 payload too large 에러 해결
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// CORS 처리 -- 수정필요
app.use(cors());
app.use((req, res, next) => {
    const allowedOrigins = ["http://louk342.iptime.org:8080", "http://localhost:3000"];
    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin); // 요청 출처를 허용
    }
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE, OPTIONS"); // 허용할 HTTP 메서드
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization"); // 허용할 헤더
    res.header("Access-Control-Allow-Credentials", "true"); // 자격 증명 허용
    next();
});
// CORS

// OPTIONS 메서드에 대한 핸들러 추가 (프리플라이트 요청 처리)
app.options("*", (req, res) => {
    res.sendStatus(200); // 모든 경로에 대해 200 OK 반환
});

// 라우터 사용
app.use("/", indexRouter);
app.use("/test", testRouter);
app.use("/board", boardRouter);
app.use("/comment", commentRouter);
app.use("/like", likeRouter);
app.use("/mypage", babyRouter);

app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/image", imageRouter);

// 이미지 반환
app.use("/image/thumbnails", express.static("./image/thumbnails"));

app.use("/image", express.static("./image"));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
