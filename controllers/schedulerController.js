const schedulerModel = require('../models/scheduler');

module.exports = {

    // 스케줄러 항목 생성
    createscheduler: async function (req) {
        try {
            const { user_login_id, scheduler_content, scheduler_date, scheduler_color } = req.body;
            
            // scheduler_date에서 날짜 부분만 추출
            const date = new Date(scheduler_date);
            const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
            
            const query = `INSERT INTO scheduler (user_login_id, scheduler_content, scheduler_date, scheduler_color) VALUES (?, ?, ?, ?)`;
            await db.query(query, [user_login_id, scheduler_content, formattedDate, scheduler_color]);
            
            console.log("스케줄 생성 성공:", { user_login_id, scheduler_content, formattedDate, scheduler_color });
            return { success: true, message: "스케줄 생성 성공" };
        } catch (error) {
            console.error("스케줄 생성 실패:", error);
            return { success: false, error: "스케줄 생성 실패" };
        }
    },

    // 특정 날짜의 스케줄 조회
    getSchedule: async function (req, res, next) {
        try {
            const { scheduler_date } = req.params;
            const result = await schedulerModel.getschedule(scheduler_date);
            if (result.success && result.data.length > 0) {
                res.status(200).json({ data: result.data });
            } else {
                res.status(404).json({ message: "해당 날짜에 스케줄이 없습니다." });
            }
        } catch (err) {
            next(err);
        }
    },
    //  특정 월의 스케줄 조회
    getScheduleByMonth: async function (req, res, next) {
        try {
            const { year, month } = req.params; // year와 month를 받아온다
            const result = await schedulerModel.getscheduleByMonth(year, month);
            
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
    updateschedule: async function (data) {
        try {
            const { scheduler_id, scheduler_content, scheduler_date } = data;
            
            // scheduler_date에서 날짜 부분만 추출
            const date = new Date(scheduler_date);
            const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
            
            const query = `UPDATE scheduler SET scheduler_content = ?, scheduler_date = ? WHERE scheduler_id = ?`;
            await db.query(query, [scheduler_content, formattedDate, scheduler_id]);
            
            console.log("스케줄 업데이트 성공:", { scheduler_id, scheduler_content, formattedDate });
            return { success: true, message: "스케줄 업데이트 성공" };
        } catch (error) {
            console.error("스케줄 업데이트 실패:", error);
            return { success: false, error: "스케줄 업데이트 실패" };
        }
    },
    // 스케줄러 항목 삭제
    deleteScheduler: async function (req, res, next) {
        try {
            const { scheduler_id } = req.params;
            const result = await schedulerModel.deleteschedule(scheduler_id);
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
