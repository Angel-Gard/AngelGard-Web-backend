const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const secretKey = process.env.SECRET_KEY || 'um1y6ywqx8jy370';

const blacklistPath = path.join(__dirname, '../blacklist.json');

// 블랙리스트 파일을 읽어옴
const readBlacklist = () => {
    if (fs.existsSync(blacklistPath)) {
        const data = fs.readFileSync(blacklistPath, 'utf8');
        return JSON.parse(data);
    }
    return {};
};

// 블랙리스트 파일에 저장
const writeBlacklist = (blacklist) => {
    fs.writeFileSync(blacklistPath, JSON.stringify(blacklist, null, 2));
};

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        const blacklist = readBlacklist();

        if (blacklist[token]) {
            return res.sendStatus(403); // 블랙리스트에 있는 토큰
        }

        jwt.verify(token, secretKey, (err, user) => {
            if (err) {
                return res.sendStatus(403); // 유효하지 않은 토큰
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401); // 인증 헤더가 없음
    }
};

module.exports = authenticateJWT;