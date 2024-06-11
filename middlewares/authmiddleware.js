const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY || "um1y6ywqx8jy370";

const redis = require('redis');
const client = redis.createClient();

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        client.get(token, (err, data) => {
            if (err || data === 'invalid') {
                return res.sendStatus(403);
            }
            jwt.verify(token, secretKey, (err, user) => {
                if (err) {
                    return res.sendStatus(403);
                }
                req.user = user;
                req.token = token; // req 객체에 토큰을 추가
                console.log('Decoded user:', req.user, req.user.user_login_id); // 로그 추가
                next();
            });
        });
    } else {
        res.sendStatus(401);
    }
};

module.exports = authenticateJWT;
