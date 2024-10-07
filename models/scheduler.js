const db = require("../config/db");

module.exports = {
    // 스케줄러 항목 생성
    createscheduler: async function (req) {
        try {
            const { user_login_id, scheduler_content, scheduler_date, scheduler_color } = req.body;
            const query = `INSERT INTO scheduler (user_login_id, scheduler_content, scheduler_date, scheduler_color) VALUES (?, ?, ?, ?)`;
            await db.query(query, [user_login_id, scheduler_content, scheduler_date, scheduler_color]);
            console.log("스케줄 생성 성공:", { user_login_id, scheduler_content, scheduler_date, scheduler_color });
            return { success: true, message: "스케줄 생성 성공" };
        } catch (error) {
            console.error("스케줄 생성 실패:", error);
            return { success: false, error: "스케줄 생성 실패" };
        }
    },

    // 특정 날짜의 스케줄 조회
    getschedule: async function (scheduler_date) {
        try {
            const query = `SELECT * FROM scheduler WHERE scheduler_date = ?`;
            const [rows] = await db.query(query, [scheduler_date]);
            if (rows.length > 0) {
                console.log("스케줄 조회 성공:", { scheduler_date });
                return { success: true, data: rows };
            } else {
                return { success: false, error: "해당 날짜에 스케줄이 없습니다." };
            }
        } catch (error) {
            console.error("스케줄 조회 실패:", error);
            return { success: false, error: "스케줄 조회 실패" };
        }
    },
    getscheduleByMonth: async function (year, month) {
        try {
          
            const query = `SELECT * FROM scheduler WHERE YEAR(scheduler_date) = ? AND MONTH(scheduler_date) = ?`;
            const [rows] = await db.query(query, [year, month]); // 해당 월의 데이터만 가져옴
    
            if (rows.length > 0) {
                console.log("해당 월 스케줄 조회 성공:", { year, month });
                return { success: true, data: rows };
            } else {
                return { success: false, message: "해당 월에 스케줄이 없습니다." };
            }
        } catch (error) {
            console.error("스케줄 조회 실패:", error);
            return { success: false, error: "스케줄 조회 실패" };
        }
    },
    
    
// 스케줄러 항목 업데이트
updateschedule: async function (data) {
    try {
       
        const { scheduler_id, scheduler_content, scheduler_date } = data; 
        const query = `UPDATE scheduler SET scheduler_content = ?, scheduler_date = ? WHERE scheduler_id = ?`;
        await db.query(query, [scheduler_content, scheduler_date, scheduler_id]); // 쿼리 실행
        console.log("스케줄 업데이트 성공:", { scheduler_id, scheduler_content, scheduler_date });
        return { success: true, message: "스케줄 업데이트 성공" };
    } catch (error) {
        console.error("스케줄 업데이트 실패:", error);
        return { success: false, error: "스케줄 업데이트 실패" };
    }
},


    // 스케줄러 항목 삭제
    deleteschedule: async function (scheduler_id) {
        try {
            const query = `DELETE FROM scheduler WHERE scheduler_id = ?`;
            await db.query(query, [scheduler_id]); 
            console.log("스케줄 삭제 성공:", { scheduler_id });
            return { success: true, message: "스케줄 삭제 성공" };
        } catch (error) {
            console.error("스케줄 삭제 실패:", error);
            return { success: false, error: "스케줄 삭제 실패" };
        }
    }
};
