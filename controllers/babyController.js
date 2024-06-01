const babys = require("../models/baby");

module.exports = {
    createBaby: async function (req, res, next) {
        try {
            const result = await babys.createBaby(req);
            const { user_id, baby_id } = result;
            res.status(200).json({ user_id: user_id, baby_id: baby_id });
        } catch (err) {
            next(err);
        }
    },
    getBabyById: async function (req, res, next) {
        try {
            const { user_id, baby_id } = req.params;
            const baby = await babys.getBabyById(user_id, baby_id);
            if (baby) {
                res.status(200).json({ baby: baby });
            } else {
                res.status(404).json({ message: "아기를 찾을 수 없습니다." });
            }
        } catch (err) {
            next(err);
        }
    },
    getAllBabiesByUserId: async function (req, res, next) {
        try {
            const { user_id } = req.params;
            const babies = await babys.getAllBabiesByUserId(user_id);
            if (babies.length > 0) {
                res.status(200).json({ babies: babies });
            } else {
                res.status(404).json({ message: "아기를 찾을 수 없습니다." });
            }
        } catch (err) {
            next(err);
        }
    },
    
    updateBaby: async function (req, res, next) {
        try {
            const { user_id, baby_id } = req.params;
            const baby = await babys.getBabyById(user_id, baby_id);
            if (!baby) {
                res.status(404).json({message: "아기를 찾을 수 없습니다."});
                return;
            }
            res.status(200).json({ baby: baby });
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
            res.status(200).json( { baby: updatedBaby });
        } catch (err) {
            next(err);
        }
    },
    deleteBaby: async function (req, res, next) {
        try {
            const { user_id, baby_id } = req.params;
            const baby = await babys.getBabyById(user_id, baby_id);
            if (!baby) {
                res.status(404).json({ message: "아기를 찾을 수 없습니다." });
                return;
            }
            await babys.deleteBaby(user_id, baby_id);
            res.status(200).json({ message: "아기 정보가 삭제되었습니다." });
        } catch (err) {
            next(err);
        }
    }
};
