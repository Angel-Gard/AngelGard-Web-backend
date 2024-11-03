const schedulerModel = require('../models/scheduler');

module.exports = {
    // 스케줄러 항목 생성
    createScheduler: async function (req, res, next) {
        try {
            const { user_login_id } = req.params;
            const result = await schedulerModel.createscheduler(user_login_id, req.body);
            if (result.success) {
                res.status(201).json({ message: "스케줄이 성공적으로 생성되었습니다.", data: result });
            } else {
                res.status(400).json({ message: "스케줄 생성에 실패했습니다.", error: result.error });
            }
        } catch (err) {
            next(err);
        }
    },

    // 특정 날짜의 스케줄 조회
    getSchedule: async function (req, res, next) {
        try {
            const { user_login_id, scheduler_date } = req.params;
            const result = await schedulerModel.getschedule(user_login_id, scheduler_date);
            if (result.success && result.data.length > 0) {
                res.status(200).json({ data: result.data });
            } else {
                res.status(404).json({ message: "해당 날짜에 스케줄이 없습니다." });
            }
        } catch (err) {
            next(err);
        }
    },

    // 특정 월의 스케줄 조회
    getScheduleByMonth: async function (req, res, next) {
        try {
            const { user_login_id, year, month } = req.params;
            const result = await schedulerModel.getscheduleByMonth(user_login_id, year, month);
            if (result.success && result.data.length > 0) {
                res.status(200).json({ data: result.data });
            } else {
                res.status(404).json({ message: "해당 월에 스케줄이 없습니다." });
            }
        } catch (err) {
            next(err);
        }
    },

    // 스케줄러 항목 업데이트
    updateScheduler: async function (req, res, next) {
        try {
            const { user_login_id, scheduler_id } = req.params;
            const result = await schedulerModel.updateschedule(user_login_id, { ...req.body, scheduler_id });
            if (result.success) {
                res.status(200).json({ message: "스케줄이 성공적으로 업데이트되었습니다.", data: result });
            } else {
                res.status(404).json({ message: "스케줄 업데이트에 실패했습니다.", error: result.error });
            }
        } catch (err) {
            next(err);
        }
    },

    // 스케줄러 항목 삭제
    deleteScheduler: async function (req, res, next) {
        try {
            const { user_login_id, scheduler_id } = req.params;
            const result = await schedulerModel.deleteschedule(user_login_id, scheduler_id);
            if (result.success) {
                res.status(200).json({ message: "스케줄이 성공적으로 삭제되었습니다." });
            } else {
                res.status(404).json({ message: "스케줄 삭제에 실패했습니다.", error: result.error });
            }
        } catch (err) {
            next(err);
        }
    }
};
