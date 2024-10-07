const db = require("../config/db");


// 서버 URL을 설정합니다. (환경 변수로도 설정 가능)
const serverUrl = 'http://localhost:3000';
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

        const sql = `SELECT count(*) AS count FROM baby_board WHERE user_login_id = ?`;
        const [rows] = await db.query(sql, [user_login_id]);

        const totalCount = Number(rows[0].count);
        const pnTotal = Math.ceil(totalCount / contentSize);
        const pnStart = (Math.ceil(pageNum / 5) - 1) * 5 + 1;
        let pnEnd = pnStart + 4;
        if (pnEnd > pnTotal) pnEnd = pnTotal;

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

            // 이미지 경로를 절대 경로로 변환
            if (row.baby_board_image) {
                row.baby_board_image = `${serverUrl}/uploads/${row.baby_board_image}`;
            }
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
