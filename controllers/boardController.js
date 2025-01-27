const path = require("path");
const boards = require("../models/board");
const multer = require("multer");
const fs = require("fs");

//********* 이미지 세팅  ********* */
// Multer 설정 아이디를 가지고 파일이름을 아이디로 하기
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = path.join(__dirname, "../../resource/img/thumbnails");
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        return cb(null, dir);
    },
    filename: function (req, file, cb) {
        if (file) {
            const filename = `${Date.now()}-${file.originalname}`;
            cb(null, filename); // 파일 이름을 ID로 설정하고 원본 확장자 추가
        } else {
            cb(null, null);
        }
    },
});

// 파일 유형 확인 (이미지 파일만 허용)
const fileFilter = (req, file, cb) => {
    if (!file) {
        cb(null, true);
    } else {
        // 허용할 이미지 파일의 MIME 타입
        const allowedTypes = ["image/jpeg", "image/png", "image/gif"];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true); // 파일 허용
        } else {
            cb(new Error("이미지 파일만 업로드 가능합니다."), false); // 파일 거부
        }
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
});

//********* 이미지 세팅  ********* */

// 이미지 삭제 함수
const deleteImage = function (filename) {
    console.log(filename);
    // 이미지 경로 설정
    const imagePath = path.join(__dirname, "../../resource/img/thumbnails/", filename);
    // 파일 삭제
    fs.unlink(imagePath, (err) => {
        if (err) {
            console.error("이미지 삭제 에러:", err);
        } else {
            console.log("이미지 삭제 완료:", filename);
        }
    });
};

module.exports = {
    // 게시글 목록
    selectBoardList: async function (req, res, next) {
        await boards
            .selectBoardList(req)
            .then((result) => {
                if (result) {
                    res.status(200).json(result);
                } else {
                    res.status(404).json({ message: "게시글 목록이 존재하지 않습니다.", success: false });
                }
            })
            .catch((err) => {
                next(err);
            });
    },
    // 게시글 상세
    selectBoard: async function (req, res, next) {
        await boards
            .selectBoard(req)
            .then((result) => {
                if (result) {
                    res.status(200).json(result);
                } else {
                    res.status(200).json({ board_title: "게시글을 찾을 수 없습니다.", message: "게시글을 찾을 수 없습니다.", success: false });
                }
            })
            .catch((err) => {
                next(err);
            });
    },
    // 게시글 생성
    createBoard: async function (req, res, next) {
        let filePath = null;
        upload.single("board_thumbnail")(req, res, async (err) => {
            try {
                if (req.file) {
                    // 이미지가 있을 경우
                    filePath = "http://34.47.76.73:3000/img/thumbnails/" + req.file.filename;
                }

                // ********************null 공백 체크************************
                // user_login_id가 없으면
                if (req.body.user_login_id === "null" || !req.body.user_login_id) {
                    console.log("createBoard: user_login_id is null");

                    return res.status(400).json({ message: "user_login_id를 확인해주세요", success: false });
                }
                // board_title이 ""이거나 null일때
                if (req.body.board_title === "" || !req.body.board_title) {
                    console.log("createBoard : no board_title");
                    console.log(filePath);
                    if (filePath) {
                        // 파일 경로에서 파일명 추출
                        let filename = path.basename(filePath);
                        // 이미지 삭제 함수 호출
                        deleteImage(filename);
                    }
                    return res.status(400).json({ message: "게시글 제목을 입력해주세요", success: false });
                }
                // board_content가 ""이거나 null일때
                if (req.body.board_content === "" || !req.body.board_content) {
                    console.log("createBoard : no board_content");

                    if (filePath) {
                        // 파일 경로에서 파일명 추출
                        let filename = path.basename(filePath);
                        // 이미지 삭제 함수 호출
                        deleteImage(filename);
                    }
                    return res.status(400).json({ message: "게시글 내용을 입력해주세요", success: false });
                }
                // ********************null 공백 체크 end************************

                await boards
                    .createBoard(req, filePath)
                    .then((result) => {
                        if (result) {
                            res.status(200).json({ board_id: result, message: "게시글 생성 완료", success: true });
                        } else {
                            res.status(404).json({ message: "게시글 생성 실패", success: false });
                        }
                    })
                    .catch((err) => {
                        next(err);
                    });
            } catch (error) {
                console.error("게시글 생성 에러 : ", error);
                next(error);
            }
        });
    },
    // 게시글 수정(조회)
    updateBoard: async function (req, res, next) {
        await boards
            .updateBoard(req)
            .then((result) => {
                if (result) {
                    res.status(200).json(result);
                } else {
                    res.status(404).json({ message: "수정할 게시글 조회 실패" });
                }
            })
            .catch((err) => {
                next(err);
            });
    },
    // 게시글 수정
    updateBoardProcess: async function (req, res, next) {
        let filePath = "null"; // 이미지 경로 -- default 'null'
        let lastfilePath;

        upload.single("board_thumbnail")(req, res, async (err) => {
            try {
                if (req.file) {
                    // 이미지가 있을 경우
                    filePath = "http://34.47.76.73:3000/img/thumbnails/" + req.file.filename;
                }
                await boards
                    .selectImage(req)
                    .then((result) => {
                        // 기존 이미지 path 저장
                        lastfilePath = result.board_thumbnail;

                        // 게시글 수정 처리
                        return boards.updateBoardProcess(req, filePath);
                    })
                    .then((result) => {
                        if (result) {
                            // 수정 성공 시
                            // 기존 이미지와 변경할 이미지가 다르고 둘다 null이 아니면 기존 이미지 삭제
                            if (filePath !== "null" && lastfilePath !== filePath && lastfilePath !== "null") {
                                // 파일 경로에서 파일명 추출
                                let filename = path.basename(lastfilePath);
                                // 이미지 삭제 함수 호출
                                deleteImage(filename);
                            }
                            res.status(200).json({ message: "게시글 수정 완료", success: true });
                        } else {
                            res.status(404).json({ message: "게시글 수정 실패", success: false });
                        }
                    })
                    .catch((err) => {
                        next(err);
                    });
            } catch (error) {
                console.error("게시글 수정 에러 : ", error);
                next(error);
            }
        });
    },
    // 게시글 삭제
    deleteBoard: async function (req, res, next) {
        await boards
            .selectImage(req)
            .then((result) => {
                // 기존 이미지 path 저장
                lastfilePath = result.board_thumbnail;
                return boards.deleteBoard(req);
            })
            .then((result) => {
                if (result) {
                    // 파일 경로에서 파일명 추출
                    let filename = path.basename(lastfilePath);
                    // 이미지 삭제 함수 호출
                    deleteImage(filename);
                    res.status(200).json({ message: "게시글 삭제 완료", success: true });
                } else {
                    res.status(404).json({ message: "게시글 삭제 실패", success: false });
                }
            })
            .catch((err) => {
                next(err);
            });
    },
    // 좋아요 목록
    selectLikedBoardList: async function (req, res, next) {
        await boards
            .selectLikedBoardList(req)
            .then((result) => {
                if (result) {
                    res.status(200).json(result);
                } else {
                    res.status(404).json({ message: "좋아요 목록이 존재하지 않습니다.", success: false });
                }
            })
            .catch((err) => {
                next(err);
            });
    },
    // 작성한 목록
    selectPostedBoardList: async function (req, res, next) {
        await boards
            .selectPostedBoardList(req)
            .then((result) => {
                if (result) {
                    res.status(200).json(result);
                } else {
                    res.status(404).json({ message: "작성한 목록이 존재하지 않습니다.", success: false });
                }
            })
            .catch((err) => {
                next(err);
            });
    },
};
