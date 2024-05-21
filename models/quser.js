
const pool = require('../config/db')

exports.MsignUp = async (data) => {
    const query = `INSERT INTO user (user_id, user_pw, user_nickname) VALUES (?, ?, ?)`;
    try {
        const [result] = await pool.query(query, [data.id, data.pw, data.username]);
        console.log('Database Insert Result:', result);
        return result;
    } catch (error) {
        console.error('Database Insert Error:', error);
        throw error;
    }
};

exports.Mlogin = async (data) => {
    const query = `SELECT * FROM user WHERE user_id = ?`;
    const [rows] = await pool.query(query, [data.id]);
    return rows;
};

exports.Minfo = async (id) => {
    const query = `SELECT * FROM user WHERE user_id = ?`;
    console.log('Executing query:', query, 'with ID:', id); // 로그 추가
    const [rows] = await pool.query(query, [id]);
    return rows;
};

exports.Mupdate = async (data) => {
    const query = `UPDATE user SET user_pw = ?, user_nickname = ? WHERE user_id = ?`;
    console.log('Executing update query:', query, 'with data:', data); // 로그 추가
    try {
        const [result] = await pool.query(query, [data.pw, data.username, data.id]);
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