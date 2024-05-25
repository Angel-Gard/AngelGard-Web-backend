const createError = require("http-errors");
const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const methodOverride = require("method-override");

// 라우터
const testRouter = require("./routes/testRouter");
const boardRouter = require("./routes/boardRouter");
const commentRouter = require("./routes/commentRouter");
const babyRouter = require("./routes/babyrouter");

const indexRouter = require("./routes/index");
const userRouter = require("./routes/user");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(methodOverride("_method"));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// CORS 처리 -- 수정필요
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // 모든 출처 허용
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE"); // 허용할 HTTP 메서드
    res.header("Access-Control-Allow-Headers", "Content-Type"); // 허용할 헤더
    next();
});
// CORS

app.use("/test", testRouter);
app.use("/board", boardRouter);
app.use("/comment", commentRouter);
app.use("/baby", babyRouter); 

app.use("/", indexRouter);
app.use("/user", userRouter);

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
