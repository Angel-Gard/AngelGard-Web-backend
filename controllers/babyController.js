const babys = require("../models/baby");

module.exports = {
    createBaby: async function (req, res, next) {
        try {
            const result = await babys.createBaby(req);
            const { user_id, baby_id } = result;
            const baby = await babys.getBabyById(user_id, baby_id);
            res.render("create", { user_id: user_id, baby_id: baby_id, baby: baby });
        } catch (err) {
            next(err);
        }
    },
    updateBaby: async function (req, res, next) {
        try {
            const { user_id, baby_id } = req.params;
            const baby = await babys.getBabyById(user_id, baby_id);
            if (!baby) {
                res.status(404).send("아기를 찾을 수 없습니다.");
                return;
            }
            res.render("baby_update", { baby: baby });
        } catch (err) {
             next(err);
        }
    },
    updateBabyProcess: async function (req, res, next) {
        try {
            const { user_id, baby_id } = req.params;
            const updateData = req.body;
            await babys.updateBaby(user_id, baby_id, updateData);
            const updatedBaby = await babys.getBabyById(user_id, baby_id);
            res.render("create", { baby: updatedBaby });
        } catch (err) {
            next(err);
        }
    },
    deleteBaby: async function (req, res, next) {
     
    }
};
