const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 20, // 동시에 열 수 있는 최대 연결 수
    queueLimit: 0,
});

module.exports = {
    connection: async function () {
        const connection = await pool.getConnection(async (conn) => conn);
        try {
            return connection;
        } catch (err) {
            console.log(err);
            connection.release();
        }
    },
    query: async function (query, args) {
        let rows;
        const connection = await this.connection(async (conn) => conn);
        try {
            if (!args) {
                rows = await connection.query(query);
            } else {
                rows = await connection.query(query, args);
            }
        } catch (err) {
            console.log(err);
        } finally {
            if (connection) connection.release(); // 연결 해제 보장
        }

        return rows;
    },
};
