const db = require("../config/db");

module.exports = {
    createBaby: async function (req) {
        const {  user_login_id, baby_sex, baby_birth, baby_weight, baby_height, baby_name } = req.body;
        const sql = `INSERT INTO baby ( user_login_id, baby_sex, baby_birth, baby_weight, baby_height, baby_name) VALUES (?, ?, ?, ?, ?, ?)`;
        const [rows] = await db.query(sql, [ user_login_id, baby_sex, baby_birth, baby_weight, baby_height, baby_name]);
        return {  user_login_id:  user_login_id, baby_id: Number(rows.insertId) };  // 수정된 부분
    },
    getBabyById: async function ( user_login_id, baby_id) {
        const sql = `SELECT * FROM baby WHERE  user_login_id = ? AND baby_id = ?`;
        const [rows] = await db.query(sql, [ user_login_id, baby_id]);
        return rows[0];
    },
    getAllBabiesByUserId: async function ( user_login_id) {
        const sql = `SELECT * FROM baby WHERE  user_login_id = ?`;
        const [rows] = await db.query(sql, [ user_login_id]);
        return rows;
    },
    updateBaby: async function ( user_login_id, baby_id, updateData) {
        const { baby_sex, baby_birth, baby_weight, baby_height, baby_name } = updateData;
        const sql = `UPDATE baby SET baby_sex = ?, baby_birth = ?, baby_weight = ?, baby_height = ?, baby_name = ? WHERE  user_login_id = ? AND baby_id = ?`;
        await db.query(sql, [baby_sex, baby_birth, baby_weight, baby_height, baby_name,  user_login_id, baby_id]);
    },
    deleteBaby: async function ( user_login_id, baby_id) {
        const sql = `DELETE FROM baby WHERE  user_login_id = ? AND baby_id = ?`;
        await db.query(sql, [ user_login_id, baby_id]);
    }
};
