// 쿼리 저장
const db = require("../config/db");

module.exports = {
    selectBoardList: async function (req, res) {
        const pageNum = Number(req.query.page) || 1; // 쿼리스트링으로 받을 페이지 번호 값, 기본값은 1
        const contentSize = 5; // 페이지에서 보여줄 컨텐츠 수.
        const pnSize = 5; // 페이지네이션 개수 설정.
        const skipSize = (pageNum - 1) * contentSize; // 다음 페이지 갈 때 건너뛸 리스트 개수.

        const sql = `SELECT count(*) AS count FROM board`;
        const [rows] = await db.query(sql);

        const totalCount = Number(rows[0].count); // 전체 글 개수.
        const pnTotal = Math.ceil(totalCount / contentSize); // 페이지네이션의 전체 카운트
        const pnStart = (Math.ceil(pageNum / pnSize) - 1) * pnSize + 1; // 현재 페이지의 페이지네이션 시작 번호.
        let pnEnd = pnStart + pnSize - 1; // 현재 페이지의 페이지네이션 끝 번호.

        // 마지막 페이지 페이지네이션 끝 번호 처리
        if (pnEnd > pnTotal && Math.floor(pnEnd / pnSize) - 1 === Math.floor(pnTotal / pnSize)) {
            pnEnd = pnTotal;
        }

        const sql2 = `SELECT board.board_id, board.board_title, board.board_date, user.user_nickname, board.board_thumbnail, COUNT(likes.likes_id) AS like_count, user.user_image
        FROM board LEFT JOIN user ON board.user_login_id = user.user_login_id 
        LEFT JOIN likes ON board.board_id = likes.board_id
        GROUP BY board.board_id
        ORDER BY board_id DESC LIMIT ?, ?`;
        const [rows2] = await db.query(sql2, [skipSize, contentSize]);
        if (rows2.length === 0) {
            console.log(`게시글 목록 조회 실패`);
            return false;
        }

        // 날짜 형식을 yyyy-mm-dd로 변환
        rows2.forEach((row) => {
            const date = new Date(row.board_date);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0"); // 월을 2자리로 변환
            const day = String(date.getDate()).padStart(2, "0"); // 일을 2자리로 변환
            row.board_date = `${year}.${month}.${day}`;
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
    selectBoard: async function (req, res) {
        const sql = `SELECT board.board_date, user.user_nickname, board.board_title, board.board_content, board.user_login_id, user.user_image
        FROM board LEFT JOIN user ON board.user_login_id = user.user_login_id WHERE board_id = ?`;
        const [rows] = await db.query(sql, [Number(req.params.board_id)]);
        if (rows.length === 0) {
            console.log(`board_id ${req.params.board_id} : 게시글 조회 실패`);
            return false;
        }

        // 날짜 형식을 yyyy-mm-dd로 변환
        const board = rows[0];
        const date = new Date(board.board_date);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0"); // 월을 2자리로 변환
        const day = String(date.getDate()).padStart(2, "0"); // 일을 2자리로 변환
        board.board_date = `${year}-${month}-${day}`;
        return board;
    },
    createBoard: async function (req, filePath) {
        const sql = `INSERT INTO board (user_login_id, board_title, board_content, board_thumbnail, board_date) VALUES(?,?,?,?,NOW())`;
        const [rows] = await db.query(sql, [req.body.user_login_id, req.body.board_title, req.body.board_content, filePath]);
        if (rows.affectedRows === 0) {
            console.log(`게시글 생성 실패`);
            return false;
        }
        return Number(rows.insertId);
    },
    updateBoard: async function (req, res) {
        const sql = `SELECT board_title, board_content, board_thumbnail 
                    FROM board WHERE board_id = ?`;
        const [rows] = await db.query(sql, [Number(req.params.board_id)]);
        if (rows.length === 0) {
            console.log(`board_id ${req.params.board_id} : 게시글 수정(조회) 실패`);
            return false;
        }
        return rows[0];
    },
    updateBoardProcess: async function (req, filePath) {
        if (filePath !== "null") {
            // 이미지 변경이 있을 경우
            const sql = `UPDATE board SET board_title=?, board_content=?, board_thumbnail=? WHERE board_id = ?`;
            const [rows] = await db.query(sql, [req.body.board_title, req.body.board_content, filePath, Number(req.params.board_id)]);
            if (rows.affectedRows === 0) {
                console.log(`board_id ${req.params.board_id} : 게시글 수정 실패`);
                return false;
            }
        } else {
            // 이미지 변경이 없을 경우
            const sql = `UPDATE board SET board_title=?, board_content=? WHERE board_id = ?`;
            const [rows] = await db.query(sql, [req.body.board_title, req.body.board_content, Number(req.params.board_id)]);
            if (rows.affectedRows === 0) {
                console.log(`board_id ${req.params.board_id} : 게시글 수정 실패`);
                return false;
            }
        }

        return true;
    },
    deleteBoard: async function (req, res) {
        const boardId = req.params.board_id;

        // 게시글 댓글, 좋아요 삭제
        var DeletedComments = false; // 댓글 삭제 확인
        var Deletedlikes = false; // 좋아요 삭제 확인
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
        const sql3 = `SELECT count(*) AS count FROM comment WHERE board_id = ?`;
        const [rows3] = await db.query(sql3, [Number(req.params.board_id)]);
        // 좋아요 개수
        const totalCount3 = Number(rows3[0].count);

        // 좋아요 개수가 있다면 삭제
        if (totalCount3 > 0) {
            const sql4 = `DELETE FROM likes WHERE board_id = ?`;
            const [rows4] = await db.query(sql4, [Number(req.params.board_id)]);

            // 삭제 실패
            if (rows4.affectedRows === 0) {
                console.log(`board_id ${boardId} : 게시글 좋아요 삭제 실패`);
                Deletedlikes = false;
            } else {
                Deletedlikes = true;
            }
        } else {
            // 좋아요 개수가 없으면
            Deletedlikes = true;
        }

        if (DeletedComments && Deletedlikes) {
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
    selectImage: async function (req, res) {
        const sql = `SELECT board_thumbnail FROM board WHERE board_id = ?`;
        const [rows] = await db.query(sql, [Number(req.params.board_id)]);
        if (rows.length === 0) {
            console.log(`board_id ${req.params.board_id} : 이미지 조회 실패`);
            return false;
        }
        return rows[0];
    },
    selectLikedBoardList: async function (req, res) {
        const pageNum = Number(req.query.page) || 1; // 쿼리스트링으로 받을 페이지 번호 값, 기본값은 1
        const contentSize = 5; // 페이지에서 보여줄 컨텐츠 수.
        const pnSize = 5; // 페이지네이션 개수 설정.
        const skipSize = (pageNum - 1) * contentSize; // 다음 페이지 갈 때 건너뛸 리스트 개수.

        const sql = `SELECT count(*) AS count FROM likes
            WHERE user_login_id = ?`;
        const [rows] = await db.query(sql, [req.params.user_login_id]);

        const totalCount = Number(rows[0].count); // 전체 글 개수.
        const pnTotal = Math.ceil(totalCount / contentSize); // 페이지네이션의 전체 카운트
        const pnStart = (Math.ceil(pageNum / pnSize) - 1) * pnSize + 1; // 현재 페이지의 페이지네이션 시작 번호.
        let pnEnd = pnStart + pnSize - 1; // 현재 페이지의 페이지네이션 끝 번호.

        // 마지막 페이지 페이지네이션 끝 번호 처리
        if (pnEnd > pnTotal && Math.floor(pnEnd / pnSize) - 1 === Math.floor(pnTotal / pnSize)) {
            pnEnd = pnTotal;
        }

        const sql2 = `SELECT board.board_id, board.board_title, board.board_date, user.user_nickname, board.board_thumbnail, COUNT(likes.likes_id) AS like_count, user.user_image
            FROM board LEFT JOIN user ON board.user_login_id = user.user_login_id 
            LEFT JOIN likes ON board.board_id = likes.board_id
            WHERE likes.user_login_id =?
            GROUP BY board.board_id
            ORDER BY board_id DESC LIMIT ?, ?`;
        const [rows2] = await db.query(sql2, [req.params.user_login_id, skipSize, contentSize]);
        if (rows2.length === 0) {
            console.log(`게시글 목록 조회 실패`);
            return false;
        }

        // 날짜 형식을 yyyy-mm-dd로 변환
        rows2.forEach((row) => {
            const date = new Date(row.board_date);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0"); // 월을 2자리로 변환
            const day = String(date.getDate()).padStart(2, "0"); // 일을 2자리로 변환
            row.board_date = `${year}.${month}.${day}`;
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
    selectPostedBoardList: async function (req, res) {
        const pageNum = Number(req.query.page) || 1; // 쿼리스트링으로 받을 페이지 번호 값, 기본값은 1
        const contentSize = 5; // 페이지에서 보여줄 컨텐츠 수.
        const pnSize = 5; // 페이지네이션 개수 설정.
        const skipSize = (pageNum - 1) * contentSize; // 다음 페이지 갈 때 건너뛸 리스트 개수.

        const sql = `SELECT count(*) AS count FROM board
        WHERE user_login_id = ?`;
        const [rows] = await db.query(sql, [req.params.user_login_id]);

        const totalCount = Number(rows[0].count); // 전체 글 개수.
        const pnTotal = Math.ceil(totalCount / contentSize); // 페이지네이션의 전체 카운트
        const pnStart = (Math.ceil(pageNum / pnSize) - 1) * pnSize + 1; // 현재 페이지의 페이지네이션 시작 번호.
        let pnEnd = pnStart + pnSize - 1; // 현재 페이지의 페이지네이션 끝 번호.

        // 마지막 페이지 페이지네이션 끝 번호 처리
        if (pnEnd > pnTotal && Math.floor(pnEnd / pnSize) - 1 === Math.floor(pnTotal / pnSize)) {
            pnEnd = pnTotal;
        }
        const sql2 = `SELECT board.board_id, board.board_title, board.board_date, user.user_nickname, board.board_thumbnail, COUNT(likes.likes_id) AS like_count, user.user_image
        FROM board LEFT JOIN user ON board.user_login_id = user.user_login_id 
        LEFT JOIN likes ON board.board_id = likes.board_id
        WHERE board.user_login_id = ?
        GROUP BY board.board_id
        ORDER BY board_id DESC LIMIT ?, ?`;
        const [rows2] = await db.query(sql2, [req.params.user_login_id, skipSize, contentSize]);
        if (rows2.length === 0) {
            console.log(`게시글 목록 조회 실패`);
            return false;
        }

        // 날짜 형식을 yyyy-mm-dd로 변환
        rows2.forEach((row) => {
            const date = new Date(row.board_date);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0"); // 월을 2자리로 변환
            const day = String(date.getDate()).padStart(2, "0"); // 일을 2자리로 변환
            row.board_date = `${year}.${month}.${day}`;
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
};
