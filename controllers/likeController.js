const like = require("../models/like");

module.exports = {
    selectLike: async function (req, res, next) {
        await like
            .selectLike(req)
            .then((result) => {
                if (result) {
                    res.status(200).json(result);
                } else {
                    res.status(404).json({ message: "좋아요 정보 불러오기 실패" });
                }
            })
            .catch((err) => {
                next(err);
            });
    },
    setLike: async function (req, res, next) {
        await like
            .setLike(req)
            .then((result) => {
                if (result) {
                    res.status(200).json(result);
                } else {
                    res.status(404).json({ message: "좋아요 토글 실패" });
                }
            })
            .catch((err) => {
                next(err);
            });
    },
};
