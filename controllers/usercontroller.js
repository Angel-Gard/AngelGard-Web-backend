const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/quser'); // 쿼리 모델
const { param } = require('../routes');
const secretKey = process.env.SECRET_KEY || 'um1y6ywqx8jy370';



// 회원가입
exports.CsignUp = async (req, res) => {
    console.log(req.body);
    const {id ,pw,username} = req.body;
    console.log(id ,pw,username);
    try {
        if(!id || !pw || !username ){
            res.status(403).json({message:'정보를 모두 입력해주세요'});
        }
        const bodyid = req.body.id;
        const userre = await User.MgetUserDetails(bodyid);
        console.log(userre);
        const userId = userre[0];
        console.log('bodyuserid : ',bodyid)
        if(userre.length >= 1){
            res.status(402).json({ result: false, message: '아이디 중복'});
        }
        const hashedPassword = await bcrypt.hash(req.body.pw, 10);
        const userData = { ...req.body, pw: hashedPassword };
        const result = await User.MsignUp(userData);
        console.log('signUp', result);
        res.status(200).json({ result: true });
            
        
        
    } catch (error) {
        res.status(500).json({ result: false, message: '회원가입 실패', error: error.message });
    }
};

// 로그인
exports.Clogin = async (req, res) => {
    console.log(req.body);
    const {id,pw} = req.body;
    try {
        if(!id||!pw){
            res.status(403).json({message:'정보를 모두 입력해주세요'});
        }else{
            const result = await User.Mlogin(req.body);
        //console.log('login', result);
        if (result.length >= 1) {
            const user = result[0];
            //console.log('Stored hash:', user.user_pw);
            //console.log('Entered password:', req.body.pw);
            const match = await bcrypt.compare(req.body.pw, user.user_pw);
            //console.log('Password match:', match);
            if (match) {
                const token = jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '1h' });
                res.cookie(user.user_id, token, { httpOnly: true, secure: true });
                res.json({ result: true, message: '로그인 성공', token: token, data: { user_nickname: user.user_nickname, user_id: user.user_login_id } });
            } else {
                res.status(406).json({ result: false, message: '비밀번호가 일치하지 않습니다.' });
            }
        } else {
            res.status(405).json({ result: false, message: '사용자를 찾을 수 없습니다.' });
        }
        }
        
    } catch (error) {
        console.error('로그인 중 에러 발생:', error);
        res.status(500).json({ result: false, message: '로그인 실패', error: error.message });
    }
};

//로그아웃
exports.Clogout = (req, res) => {
    try {
        res.clearCookie('token'); // 쿠키에서 JWT 토큰을 삭제
        res.json({ result: true, message: '로그아웃 성공' });
    } catch (error) {
        console.error('로그아웃 중 에러 발생:', error);
        res.status(500).json({ result: false, message: '로그아웃 실패', error: error.message });
    }
};


// 유저 정보 조회
exports.getUserDetails = async (req, res) => {
    try {
        const userId = req.params.id; // URL에서 id 값 가져오기
        if (!userId) {
            return res.status(400).json({ result: false, message: '유효한 사용자 ID가 필요합니다.' });
        }

        const result = await User.MgetUserDetails(userId);
        if (result.length > 0) {
            const user = result[0];
            res.json({ result: true, data: { id: user.user_login_id, pw: user.user_pw, nickname: user.user_nickname } });
        } else {
            res.json({ result: false, message: '사용자를 찾을 수 없습니다.' });
        }
    } catch (error) {
        console.error('Error in getUserDetails:', error);
        res.status(500).json({ result: false, message: '서버 에러', error: error.message });
    }
};

// 회원정보 수정
exports.Cupdate = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!req.user) {
            console.log('No user in request');
            return res.status(401).json({ result: false, message: '인증 실패' });
        }
        console.log('User:', req.user.id,req.user.pw,req.user.username,userId);
        let updateData = { ...req.body ,user_id: userId};
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
        console.log('delete', result);
        res.json({ result: true });
    } catch (error) {
        res.status(401).json({ result: false, message: '인증 실패' });
    }
};