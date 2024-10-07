const pool = require('../config/db')


exports.Meating = async (data) => { //섭취량 입력

    const query = `INSERT INTO feed (baby_id,feed_date,amount) VALUES (?,?,?)`;
    const result = await pool.query(query,[data.baby_id,data.today,data.amount]);
    console.log(result);
    return result;

};

exports.Mpumping = async (data) => { // 유축량 입력
    const query = `INSERT INTO intake (baby_id,intake_date,intake) VALUES (?,?,?)`;
    const result = await pool.query(query,[data.baby_id,data.today,data.intake]);
    console.log(result);
    return result;
};

exports.MMs = async(data) => {//모유수유 시간 입력
    const query = `INSERT INTO Mtime (baby_id,time,m_date) VALUES (?,?,?)`;
    const result = await pool.query(query,[data.baby_id,data.time,data.today]);
    console.log(result);
    return result;
}

//{baby_id:baby_id,y_date:Bday};


exports.MselectEating = async (data) => { // 섭취량 조회, 시간
    const query = `select amount from feed where feed_date = ? and baby_id = ?`
    const [result] = await pool.query(query,[data.date,data.baby_id]);
    console.log(result);
    return result;
}

//select * from intake where intake_date like "2024-08-28" and baby_id = 1;

exports.Mpum = async (data) => { //유축량 조회, 시간
    const query = `select intake from intake where intake_date = ? and baby_id = ?`
    const [result] = await pool.query(query,[data.date,data.baby_id])
    console.log(result);
    return result;
}

exports.MselectMS = async (data) => { //모유수유 시간 조회
    const query = `select time from Mtime where m_date = ? and baby_id = ?`
    const [result] = await pool.query(query,[data.date,data.baby_id]);
    console.log(result);
    return result;
}
