const db = require("../config/db");

module.exports = {
    // 육아일지 목록 조회
    getbabyboardList: async function (req) {
        const user_login_id = req.params.user_login_id;  // URL에서 user_login_id 추출
        if (!user_login_id) {
            throw new Error('user_login_id가 필요합니다.');
        }

        const pageNum = Number(req.query.page) || 1;
        const contentSize = 5;
        const skipSize = (pageNum - 1) * contentSize;

        // 특정 user_login_id에 대한 전체 일지 개수 조회 쿼리
        const sql = `SELECT count(*) AS count FROM baby_board WHERE user_login_id = ?`;
        const [rows] = await db.query(sql, [user_login_id]);

        const totalCount = Number(rows[0].count);
        const pnTotal = Math.ceil(totalCount / contentSize);
        const pnStart = (Math.ceil(pageNum / 5) - 1) * 5 + 1;
        let pnEnd = pnStart + 4;
        if (pnEnd > pnTotal) pnEnd = pnTotal;

        // 특정 user_login_id에 맞는 일지 목록 조회 쿼리
        const sql2 = `
            SELECT baby_board.baby_board_id, baby_board.baby_board_title, baby_board.baby_board_date, 
                   baby_board.baby_board_image, baby_board.baby_board_content, user.user_nickname 
            FROM baby_board 
            LEFT JOIN user ON baby_board.user_login_id = user.user_login_id
            WHERE baby_board.user_login_id = ?
            GROUP BY baby_board.baby_board_id
            ORDER BY baby_board_id DESC 
            LIMIT ?, ?`;

        const [rows2] = await db.query(sql2, [user_login_id, skipSize, contentSize]);

        if (rows2.length === 0) {
            return { contents: [] };  // 빈 결과 반환
        }

        rows2.forEach((row) => {
            const date = new Date(row.baby_board_date);
            row.baby_board_date = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
        });

        return {
            totalCount,
            pageNum,
            pnStart,
            pnEnd,
            pnTotal,
            contents: rows2
        };
    },
    // 개별 육아일지 조회
    getbabyboard: async function (req) {
        const sql = `SELECT baby_board.baby_board_date, baby_board.baby_board_title, baby_board.baby_board_content, baby_board.baby_board_image, user.user_nickname 
                     FROM baby_board LEFT JOIN user ON baby_board.user_login_id = user.user_login_id 
                     WHERE baby_board_id = ?`;
    
        const [rows] = await db.query(sql, [Number(req.params.baby_board_id)]);
    
        // rows가 배열이 아닐 경우에 대한 처리
        if (!Array.isArray(rows) || rows.length === 0) {
            console.log(`baby_board_id ${req.params.baby_board_id} : 일지 조회 실패`);
            return false;
        }
    
        // 날짜 형식을 yyyy-mm-dd로 변환
        const board = rows[0];
        const date = new Date(board.baby_board_date);
        
        if (!isNaN(date.getTime())) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            board.baby_board_date = `${year}-${month}-${day}`;
        } else {
            console.log("유효하지 않은 날짜입니다.");
            board.baby_board_date = null;  // 날짜가 유효하지 않을 경우
        }
    
        return board;
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
