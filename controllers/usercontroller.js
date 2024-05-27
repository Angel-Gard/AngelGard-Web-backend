const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/quser"); // 쿼리 모델
const secretKey = process.env.SECRET_KEY || "your_secret_key";

// 회원가입
exports.CsignUp = async (req, res) => {
    console.log(req.body);
    try {
        const hashedPassword = await bcrypt.hash(req.body.pw, 10);
        const userData = { ...req.body, pw: hashedPassword };
        const result = await User.MsignUp(userData);
        console.log("signUp", result);
        res.status(200).res.send("회원가입 성공");
        res.json({ result: true });
    } catch (error) {
        res.status(500).json({ result: false, message: "회원가입 실패", error: error.message });
    }
};

// 로그인
exports.Clogin = async (req, res) => {
    console.log(req.body);
    try {
        const result = await User.Mlogin(req.body);
        console.log("login", result);
        if (result.length >= 1) {
            const user = result[0];
            console.log("Stored hash:", user.user_pw);
            console.log("Entered password:", req.body.pw);
            const match = await bcrypt.compare(req.body.pw, user.user_pw);
            console.log("Password match:", match);
            if (match) {
                const token = jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: "1h" });
                res.cookie(user.user_id, token, { httpOnly: true, secure: true });
                res.json({ result: true, message: "로그인 성공", token: token, data: { user_nickname: user.user_nickname, user_id: user.user_id } });
            } else {
                res.json({ result: false, message: "비밀번호가 일치하지 않습니다." });
            }
        } else {
            res.json({ result: false, message: "사용자를 찾을 수 없습니다." });
        }
    } catch (error) {
        console.error("로그인 중 에러 발생:", error);
        res.status(500).json({ result: false, message: "로그인 실패", error: error.message });
    }
};

// 회원정보 조회
exports.Cinfo = async (req, res) => {
    try {
        const token = req.cookies.token;
        console.log("Token:", token);
        if (!token) {
            return res.status(401).json({ result: false, message: "토큰이 없습니다." });
        }
        const decoded = jwt.verify(token, secretKey);
        console.log("Decoded ID:", decoded.id);

        const result = await User.Minfo(decoded.id);
        console.log("info", result);
        if (result.length > 0) {
            res.json({ result: true, info: result[0], message: "회원존재" });
        } else {
            res.json({ result: false, info: null, message: "존재하지 않는 회원" });
        }
    } catch (error) {
        console.error("Error in Cinfo:", error);
        res.status(401).json({ result: false, message: "인증 실패" });
    }
};

// 회원정보 수정
exports.Cupdate = async (req, res) => {
    try {
        if (!req.user) {
            console.log('No user in request');
            return res.status(401).json({ result: false, message: '인증 실패' });
        }
        console.log('User:', req.user.id,req.user.pw,req.user.username);
        let updateData = { ...req.body ,user_id: req.param};
        console.log('Update Data before password handling:', updateData);
        if (req.body.pw) {
            const hashedPassword = await bcrypt.hash(req.body.pw, 10); // 비밀번호 해싱
            updateData.pw = hashedPassword;
        }
        console.log('Update Data after password handling:', updateData);

        const result = await User.Mupdate(updateData);
        console.log('Update Result:', result);

        res.json({ result: true, message: '회원정보가 성공적으로 수정되었습니다.' });
    } catch (error) {
        console.error('Error in Cupdate:', error);
        res.status(500).json({ result: false, message: '서버 에러', error: error.message });
    }
};

// 회원정보 삭제
exports.Cdelete = async (req, res) => {
    try {
        const token = req.cookies.token;
        const decoded = jwt.verify(token, secretKey);
        const result = await User.Mdelete(decoded.id);
        console.log("delete", result);
        res.json({ result: true });
    } catch (error) {
        res.status(401).json({ result: false, message: "인증 실패" });
    }
};
