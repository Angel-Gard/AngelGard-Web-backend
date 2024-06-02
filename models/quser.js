
const pool = require('../config/db')

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

exports.MgetUserDetails = async (id) => {
    const query = `SELECT user_login_id, user_pw, user_nickname FROM user WHERE user_login_id = ?`;
    try {
        console.log('Executing query:', query, 'with ID:', id); // 로그 추가
        const [rows] = await pool.query(query, [id]);
        return rows;
    } catch (error) {
        console.error('Database Query Error:', error);
        throw error;
    }
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

