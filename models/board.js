// 쿼리 저장
const db = require("../config/db");

module.exports = {
    selectBoardList: async function (req, res) {
        const pageNum = Number(req.query.page) || 1; // 쿼리스트링으로 받을 페이지 번호 값, 기본값은 1
        const contentSize = 10; // 페이지에서 보여줄 컨텐츠 수.
        const pnSize = 5; // 페이지네이션 개수 설정.
        const skipSize = (pageNum - 1) * contentSize; // 다음 페이지 갈 때 건너뛸 리스트 개수.

        const sql = `SELECT count(*) AS count FROM board`;
        const [rows] = await db.query(sql);

        const totalCount = Number(rows[0].count); // 전체 글 개수.
        const pnTotal = Math.ceil(totalCount / contentSize); // 페이지네이션의 전체 카운트
        const pnStart = (Math.ceil(pageNum / pnSize) - 1) * pnSize + 1; // 현재 페이지의 페이지네이션 시작 번호.
        let pnEnd = pnStart + pnSize - 1; // 현재 페이지의 페이지네이션 끝 번호.

        const sql2 = `SELECT board.board_id, board.board_title, board.board_date, user.user_nickname 
        FROM board LEFT JOIN user ON board.user_id = user.user_id 
        ORDER BY board_id DESC LIMIT ?, ?`;
        const [rows2] = await db.query(sql2, [skipSize, contentSize]);
        if (rows2.length === 0) {
            console.log(`게시글 목록 조회 실패`);
            return false;
        }
        const result = {
            pageNum,
            pnStart,
            pnEnd,
            pnTotal,
            contents: rows2,
        };

        return result;
    },
    selectBoard: async function (req, res) {
        const sql = `SELECT board.board_date, user.user_nickname, board.board_title, board.board_content, board.user_id
        FROM board LEFT JOIN user ON board.user_id = user.user_id WHERE board_id = ?`;
        const [rows] = await db.query(sql, [Number(req.params.board_id)]);
        if (rows.length === 0) {
            console.log(`board_id ${req.params.board_id} : 게시글 조회 실패`);
            return false;
        }
        return rows[0];
    },
    createBoard: async function (req, res) {
        const sql = `INSERT INTO board (user_id, board_title, board_content, board_date) VALUES(?,?,?,NOW())`;
        const [rows] = await db.query(sql, [Number(req.body.user_id), req.body.board_title, req.body.board_content]);
        if (rows.affectedRows === 0) {
            console.log(`게시글 생성 실패`);
            return false;
        }
        return Number(rows.insertId);
    },
    updateBoard: async function (req, res) {
        const sql = `SELECT board_title, board_content 
                    FROM board WHERE board_id = ?`;
        const [rows] = await db.query(sql, [Number(req.params.board_id)]);
        if (rows.length === 0) {
            console.log(`board_id ${req.params.board_id} : 게시글 수정(조회) 실패`);
            return false;
        }
        return rows[0];
    },
    updateBoardProcess: async function (req, res) {
        const sql = `UPDATE board SET board_title=?, board_content=? WHERE board_id = ?`;
        const [rows] = await db.query(sql, [req.body.board_title, req.body.board_content, Number(req.params.board_id)]);

        if (rows.affectedRows === 0) {
            console.log(`board_id ${req.params.board_id} : 게시글 수정 실패`);
            return false;
        }
        return true;
    },
    deleteBoard: async function (req, res) {
        const boardId = req.params.board_id;

        // 게시글 댓글 삭제
        var DeletedComments = false; // 댓글 삭제 확인
        const sql1 = `SELECT count(*) AS count FROM comment WHERE board_id = ?`;
        const [rows1] = await db.query(sql1, [Number(boardId)]);

        const totalCount = Number(rows1[0].count); // 댓글 개수

        if (totalCount > 0) {
            // 댓글이 하나 이상
            const sql2 = `DELETE FROM comment WHERE board_id=?`;
            const [rows2] = await db.query(sql2, [Number(boardId)]);

            if (rows2.affectedRows === 0) {
                console.log(`board_id ${boardId} : 게시글 댓글 삭제 실패`);
                DeletedComments = false;
            } else {
                DeletedComments = true;
            }
        } else {
            // 댓글이 없으면
            DeletedComments = true;
        }

        if (DeletedComments) {
            const sql = `DELETE FROM board WHERE board_id=?`;
            const [rows] = await db.query(sql, [Number(boardId)]);

            //rows.affectedRows는 쿼리를 실행한 후에 변경된 행의 수
            if (rows.affectedRows === 0) {
                // 변경된 행이 없다면
                console.log(`board_id ${boardId}: 게시글 삭제 실패`);
                return false;
            }
            return true;
        }

        return false;
    },
};
