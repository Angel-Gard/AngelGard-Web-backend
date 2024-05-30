const pool = require('../config/db')

//이미지 경로 저장
exports.imageup = async ({ filePath, userId }) => {
    const query = `UPDATE user  SET user_image = ? WHERE user_login_id = ?`
    const [result] = await pool.query(query,[filePath, userId]);
    return result;
};

//이미지 조회 getimage
exports.getimage = async (data) => {
    const query = `SELECT user_image FROM user WHERE user_login_id = ?`;
    console.log(data)
    const [result] = await pool.query(query,[data]);
    return result;
};