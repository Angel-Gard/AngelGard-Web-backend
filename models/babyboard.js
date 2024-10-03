const db = require("../config/db");

module.exports = {
    // 육아일지 목록 조회
   
    // 개별 육아일지 조회
    getbabyboard: async function (req) {
        const sql = `SELECT baby_board.baby_board_date, baby_board.baby_board_title, baby_board.baby_board_content, baby_board.baby_board_image, user.user_nickname 
                     FROM baby_board LEFT JOIN user ON baby_board.user_login_id = user.user_login_id 
                     WHERE baby_board_id = ?`;
    
        console.log("SQL Query: ", sql);  // SQL 쿼리 로그 출력
        console.log("baby_board_id: ", req.params.baby_board_id);  // 전달된 파라미터 ID 출력
    
        try {
            const [rows] = await db.query(sql, [Number(req.params.baby_board_id)]);
    
            console.log("Query result: ", rows);  // 쿼리 실행 결과 출력
    
            if (!Array.isArray(rows) || rows.length === 0) {
                console.log(`baby_board_id ${req.params.baby_board_id} : 일지 조회 실패`);
                return false;
            }
    
            const board = rows[0];
            return board;
        } catch (error) {
            console.error("Query execution error: ", error);  // 쿼리 실행 중 발생한 오류 출력
            throw error;
        }
    },
    // 육아일지생성
    createbabyboard: async function (req, filePath) {
        const sql = `INSERT INTO baby_board (user_login_id, baby_board_title, baby_board_content, baby_board_image, baby_board_date) VALUES(?,?,?,?,NOW())`;
        const [rows] = await db.query(sql, [req.body.user_login_id, req.body.baby_board_title, req.body.baby_board_content, filePath]);

        if (rows.affectedRows === 0) {
            console.log(`일지 생성 실패`);
            return false;
        }

        return Number(rows.insertId);
    },

    // 육아일지 수정
    updatebabyboard: async function (req, filePath) {
        if (filePath !== "null") {
            // 이미지 변경이 있을 경우
            const sql = `UPDATE baby_board SET baby_board_title=?, baby_board_content=?, baby_board_image=? WHERE baby_board_id = ?`;
            const [rows] = await db.query(sql, [req.body.baby_board_title, req.body.baby_board_content, filePath, Number(req.params.baby_board_id)]);
            if (rows.affectedRows === 0) {
                console.log(`baby_board_id ${req.params.baby_board_id} : 일지 수정 실패`);
                return false;
            }
        } else {
            // 이미지 변경이 없을 경우
            const sql = `UPDATE baby_board SET baby_board_title=?, baby_board_content=? WHERE baby_board_id = ?`;
            const [rows] = await db.query(sql, [req.body.baby_board_title, req.body.baby_board_content, Number(req.params.baby_board_id)]);
            if (rows.affectedRows === 0) {
                console.log(`baby_board_id ${req.params.baby_board_id} : 일지 수정 실패`);
                return false;
            }
        }

        return true;
    },

    // 육아일지 삭제
    deletebabyboard: async function (req, res) {
        const sql = `DELETE FROM baby_board WHERE baby_board_id = ?`;
        const [rows] = await db.query(sql, [Number(req.params.baby_board_id)]);

        if (rows.affectedRows === 0) {
            console.log(`baby_board_id ${req.params.baby_board_id}: 일지 삭제 실패`);
            return false;
        }

        return true;
    },
};
