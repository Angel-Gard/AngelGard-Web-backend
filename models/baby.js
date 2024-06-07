const db = require("../config/db");

module.exports = {
    createBaby: async function (req) {
        // 공백을 제거한 요청 본문 데이터
        const cleanedBody = {};
        for (let key in req.body) {
            cleanedBody[key.trim()] = req.body[key];
        }

        const { user_login_id, baby_sex, baby_birth, baby_weight, baby_height, baby_name } = cleanedBody;
        const sql = `INSERT INTO baby (user_login_id, baby_sex, baby_birth, baby_weight, baby_height, baby_name) VALUES (?, ?, ?, ?, ?, ?)`;

        console.log("createBaby cleanedBody: ", cleanedBody);

        try {
            const result = await db.query(sql, [user_login_id, baby_sex, baby_birth, baby_weight, baby_height, baby_name]);
           

            if (Array.isArray(result) && result.length > 0) {
                const [rows] = result;
               
                return { user_login_id: user_login_id, baby_id: Number(rows.insertId) };
            } else {
                throw new Error("생성실패.");
            }
        } catch (error) {
            console.error("애기생성 오류발생: ", error);
            throw error;
        }
    },
    getBabyById: async function (user_login_id, baby_id) {
        const sql = `SELECT * FROM baby WHERE user_login_id = ? AND baby_id = ?`;
        const [rows] = await db.query(sql, [user_login_id, baby_id]);
        return rows[0];
    },
    getAllBabiesByUserId: async function (user_login_id) {
        const sql = `SELECT * FROM baby WHERE user_login_id = ?`;
        const [rows] = await db.query(sql, [user_login_id]);
        return rows;
    },
    updateBaby: async function (user_login_id, baby_id, updateData) {
        const { baby_sex, baby_birth, baby_weight, baby_height, baby_name } = updateData;
        const sql = `UPDATE baby SET baby_sex = ?, baby_birth = ?, baby_weight = ?, baby_height = ?, baby_name = ? WHERE user_login_id = ? AND baby_id = ?`;
        await db.query(sql, [baby_sex, baby_birth, baby_weight, baby_height, baby_name, user_login_id, baby_id]);
    },
    deleteBaby: async function (user_login_id, baby_id) {
        const sql = `DELETE FROM baby WHERE user_login_id = ? AND baby_id = ?`;
        await db.query(sql, [user_login_id, baby_id]);
    }
};
