// 쿼리 저장
const db = require("../config/db");

module.exports = {
    selectComments: async function (req, res) {
        const sql1 = `SELECT count(*) AS count FROM comment WHERE board_id = ?`;
        const [rows1] = await db.query(sql1, [Number(req.params.board_id)]);

        const totalCount = Number(rows1[0].count);

        const sql = `SELECT user.user_nickname, comment_date, comment_content, comment.user_id FROM comment 
        LEFT JOIN user ON comment.user_id=user.user_id WHERE board_id = ?`;
        const [rows] = await db.query(sql, [Number(req.params.board_id)]);
        if (rows.length === 0) {
            console.log(`board_id [${req.params.board_id}]: 댓글 조회 실패`);
            return false;
        }
        rows.forEach((row) => {
            const date = new Date(row.comment_date);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0"); // 월을 2자리로 변환
            const day = String(date.getDate()).padStart(2, "0"); // 일을 2자리로 변환
            const hours = date.getHours();
            const minutes = String(date.getMinutes()).padStart(2, "0");
            const period = hours >= 12 ? "PM" : "AM";
            const formattedHours = String(hours % 12 || 12).padStart(2, "0");
            row.comment_date = `${year}.${month}.${day} ${formattedHours}:${minutes} ${period}`;
        });

        const result = {
            totalCount,
            comments: rows,
        };

        return result;
    },
    createComment: async function (req, res) {
        const sql = `INSERT INTO comment (board_id, user_id, comment_content, comment_date ) VALUES(?,?,?,NOW())`;
        const [rows] = await db.query(sql, [Number(req.body.board_id), Number(req.body.user_id), req.body.comment_content]);
        if (rows.affectedRows === 0) {
            console.log(`board_id [${req.body.board_id}]: 댓글 생성 실패`);
            return false;
        }
        return true;
    },
    updateComment: async function (req, res) {
        const sql = `SELECT comment_content
        FROM comment WHERE comment_id = ?`;
        const [rows] = await db.query(sql, [Number(req.params.comment_id)]);
        if (rows.length === 0) {
            console.log(`comment_id [${req.params.comment_id}]: 수정할 댓글 조회 실패`);
            return false;
        }
        return rows[0];
    },
    updateCommentProcess: async function (req, res) {
        const sql = `UPDATE comment SET comment_content=? WHERE comment_id =?`;
        const [rows] = await db.query(sql, [req.body.comment_content, Number(req.params.comment_id)]);

        if (rows.affectedRows === 0) {
            console.log(`comment_id [${req.params.comment_id}]: 수정 실패`);
            return false;
        }
        return true;
    },
    deleteComment: async function (req, res) {
        const sql = `DELETE FROM comment WHERE comment_id=?`;
        const [rows] = await db.query(sql, [Number(req.params.comment_id)]);

        if (rows.affectedRows === 0) {
            console.log(`comment_id [${req.params.comment_id}]: 삭제 실패`);
            return false;
        }
        return true;
    },
};
