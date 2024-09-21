const db = require("../config/db");

module.exports = {
    // 육아일지 목록 조회
    selectbabyboardList: async function (req, res) {
        const pageNum = Number(req.query.page) || 1; // 쿼리스트링으로 받을 페이지 번호 값, 기본값은 1
        const contentSize = 5; // 페이지에서 보여줄 컨텐츠 수.
        const pnSize = 5; // 페이지네이션 개수 설정.
        const skipSize = (pageNum - 1) * contentSize; // 다음 페이지 갈 때 건너뛸 리스트 개수.

        const sql = `SELECT count(*) AS count FROM baby_board`;
        const [rows] = await db.query(sql);

        const totalCount = Number(rows[0].count); // 전체 일지 개수.
        const pnTotal = Math.ceil(totalCount / contentSize); // 페이지네이션의 전체 카운트
        const pnStart = (Math.ceil(pageNum / pnSize) - 1) * pnSize + 1; // 현재 페이지의 페이지네이션 시작 번호.
        let pnEnd = pnStart + pnSize - 1; // 현재 페이지의 페이지네이션 끝 번호.

        if (pnEnd > pnTotal && Math.floor(pnEnd / pnSize) - 1 === Math.floor(pnTotal / pnSize)) {
            pnEnd = pnTotal;
        }

        const sql2 = `SELECT baby_board.baby_board_id, baby_board.baby_board_title, baby_board.baby_board_date, baby_board.baby_board_image, baby_board.baby_board_content, user.user_nickname 
                      FROM baby_board LEFT JOIN user ON baby_board.user_login_id = user.user_login_id
                      GROUP BY baby_board.baby_board_id
                      ORDER BY baby_board_id DESC LIMIT ?, ?`;
        const [rows2] = await db.query(sql2, [skipSize, contentSize]);

        if (rows2.length === 0) {
            console.log(`일지 목록 조회 실패`);
            return false;
        }

        // 날짜 형식을 yyyy.mm.dd로 변환
        rows2.forEach((row) => {
            const date = new Date(row.baby_board_date);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            row.baby_board_date = `${year}.${month}.${day}`;
        });

        const result = {
            totalCount,
            pageNum,
            pnStart,
            pnEnd,
            pnTotal,
            contents: rows2,
        };

        return result;
    },

    // 개별 육아일지 조회
    selectbabyboard: async function (req, res) {
        const sql = `SELECT baby_board.baby_board_date, baby_board.baby_board_title, baby_board.baby_board_content, baby_board.baby_board_image, user.user_nickname 
                     FROM baby_board LEFT JOIN user ON baby_board.user_login_id = user.user_login_id 
                     WHERE baby_board_id = ?`;
        const [rows] = await db.query(sql, [Number(req.params.baby_board_id)]);

        if (rows.length === 0) {
            console.log(`baby_board_id ${req.params.baby_board_id} : 일지 조회 실패`);
            return false;
        }

        // 날짜 형식을 yyyy-mm-dd로 변환
        const board = rows[0];
        const date = new Date(board.baby_board_date);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        board.baby_board_date = `${year}-${month}-${day}`;

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
