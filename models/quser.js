
const pool = require('../config/db.js')

//회원가입
exports.MsignUp = async (data) => {
    const query = `INSERT INTO user (user_login_id, user_pw, user_nickname) VALUES (?, ?, ?)`;
    try {
        const [result] = await pool.query(query, [data.id, data.pw, data.username]);
        console.log('Database Insert Result:', result);
        return result;
    } catch (error) {
        console.error('Database Insert Error:', error);
        throw error;
    }
};

//로그인
exports.Mlogin = async (data) => {
    const query = `SELECT * FROM user WHERE user_login_id = ?`;
    const [rows] = await pool.query(query, [data.id]);
    return rows;
};

exports.Minfo = async (id) => {
    const query = `SELECT * FROM user WHERE user_login_id = ?`;
    console.log('Executing query:', query, 'with ID:', id); // 로그 추가
    const [rows] = await pool.query(query, [id]);
    return rows;
};


//수정
exports.Mupdate = async (data) => {
    let query;

    query = `UPDATE user SET user_pw = ?, user_nickname = ?,user_login_id = ? WHERE user_login_id = ?`;

    console.log('Executing update query:', query); // 로그 추가
    try {
        console.log(data.pw, data.username, data.id)
        const [result] = await pool.query(query, [data.pw, data.username, data.id,data.user_id]);
        console.log('Database Update Result:', result); // 로그 추가
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

//이미지 경로 저장
exports.imageup = async (data) => {
    const query = `INSERT INTO user (user_image) VALUES (?)`
    const [result] = await pool.query(query,[data.filePath]);
    return result;
};

//이미지 조회 getimage
exports.getimage = async (data) => {
    const query = `SELECT * FROM image WHERE user_login_id = ?`;
    const [result] = await pool.query(query,[data.id]);
    return result;
};

