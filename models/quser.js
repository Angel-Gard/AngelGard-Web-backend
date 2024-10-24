
const pool = require('../config/db')

//회원가입
exports.MsignUp = async (data) => {
    const query = `INSERT INTO user (user_login_id, user_pw, user_nickname) VALUES (?, ?, ?)`;
    try {
        const [result] = await pool.query(query, [data.user_login_id, data.pw, data.username]);
        return result;
    } catch (error) {
        console.error('Database Insert Error:', error);
        throw error;
    }
};

//로그인
exports.Mlogin = async (data) => {
    const query = `SELECT * FROM user WHERE user_login_id = ?`;
    const [rows] = await pool.query(query, [data.user_login_id]);
    return rows;
};

//유저 정보 조회 (아이디,비번,닉네임)
exports.MgetUserDetails = async (id) => {
    const query = `SELECT user_login_id, user_pw, user_nickname FROM user WHERE user_login_id = ?`;
    try {
        const [rows] = await pool.query(query, [id]);
        return rows;
    } catch (error) {
        console.error('Database Query Error:', error);
        throw error;
    }
};

//유저 정보 조회 (유저 번호)
exports.getUniqueUser = async (id) => {
    const query = `SELECT user_id FROM user WHERE user_login_id =?`;
    try{
        const [rows] = await pool.query(query,id);
        return rows;
    }catch(err){
        console.error('Database Query Error:', error);
        throw error;
    }
}

//수정
exports.Mupdate = async (data) => {
    let query = 'UPDATE user SET ';
    let fields = [];
    let values = [];

    if (data.pw) {
        fields.push('user_pw = ?');
        values.push(data.pw);
    }
    if (data.username) {
        fields.push('user_nickname = ?');
        values.push(data.username);
    }

    if (fields.length === 0) {
        throw new Error('No fields to update');
    }

    query += fields.join(', ') + ' WHERE user_login_id = ?';
    values.push(data.id);

    try {
        const [result] = await pool.query(query, values);
        console.log('Database Update Result:', result);
        return result;
    } catch (error) {
        console.error('Database Update Error:', error);
        throw error;
    }
};


exports.Mdelete = async (data) => {
    const query = `DELETE FROM user user_id = ?`;
    const [result] = await pool.query(query, [data.id]);
    return result;
};


exports.Selectbabyid = async (data) => { // baby_id 찾기
    console.log("quser selectbabyid : ",data);
    const query = `SELECT baby_id from baby where baby_name = ?`;
    try {
        const [result] = await pool.query(query,[data]);
        if (result.length === 0) {
          throw new Error('Baby not found');
        }
        return result[0].baby_id;
    } catch (error) {
        console.error('Error in Selectbabyid:', error);
        throw error;
      }
    
}

//유저 id로 device값 찾기
exports.SelDev = async (data) => {
    console.log('넘어온 값',data)
    // const query = `select user_fcmtoken from user where user_id =? LIMIT 1`
    const query = `select user_fcmtoken from user where user_id =?`
    try{
        const [rows] = await pool.query(query,data);
        console.log('data',rows);
        return rows;
    }catch{
        console.log('Database Query Error : ',error);
    }
}

// user_fcmtoken 업데이트
exports.UpdatDev = async (data) => {
    const query = `update user set user_fcmtoken= ?  where user_login_id = ?`;
    try{
        const [rows] = await pool.query(query,[data.user_device,data.user_login_id]);
        console.log(rows);
        return [rows];
    }catch{
        console.log('Database Query Error : ',error);
    }
}

//user_login_id로 user_fcmtoken 찾기
exports.SelDevlo = async (data) => {
    const query = `select user_fcmtoken from user where user_login_id = ?`
    try{
        const [rows] = await pool.query(query,data);
        // console.log('data',rows);
        return rows;
    }catch{
        console.log('Database Query Error : ',error);
    }
}
