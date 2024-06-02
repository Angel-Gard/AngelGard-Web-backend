// 쿼리 저장
const db = require("../config/db");

module.exports = {
    // 좋아요 수와 좋아요를 눌렀는지 조회
    selectLike: async function (req, res) {
        let liked = false;

        const sql1 = `SELECT count(*) AS count FROM likes WHERE board_id = ?`;
        const [rows1] = await db.query(sql1, [Number(req.params.board_id)]);

        // 좋아요 수
        let likes = Number(rows1[0].count);
        const sql2 = `SELECT * FROM likes WHERE board_id= ? AND user_id =?`;
        const [rows2] = await db.query(sql2, [Number(req.params.board_id), Number(req.body.user_id)]);

        if (rows2.length > 0) {
            liked = true;
        } else {
            liked = false;
        }

        const result = {
            likes,
            liked,
        };

        return result;
    },
    // 좋아요를 눌렀는지 조회 -> 토글
    setLike: async function (req, res) {
        let liked = false;

        const sql1 = `SELECT count(*) AS count FROM likes WHERE board_id = ?`;
        const [rows1] = await db.query(sql1, [Number(req.params.board_id)]);

        // 좋아요 수
        let likes = Number(rows1[0].count);

        const sql2 = `SELECT * FROM likes WHERE board_id= ? AND user_id =?`;
        const [rows2] = await db.query(sql2, [Number(req.params.board_id), Number(req.body.user_id)]);

        if (rows2.length > 0) {
            const sql = `DELETE FROM likes WHERE board_id = ? AND user_id = ?`;
            const [rows] = await db.query(sql, [Number(req.params.board_id), Number(req.body.user_id)]);
            --likes;
            liked = false;
        } else {
            const sql = `INSERT INTO likes (board_id, user_id) VALUES(?,?)`;
            const [rows] = await db.query(sql, [Number(req.params.board_id), Number(req.body.user_id)]);
            ++likes;
            liked = true;
        }

        const result = {
            likes,
            liked,
        };

        return result;
    },
};
