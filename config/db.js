const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_NAME,
    connectionLimit: 100,
});

module.exports = {
    connection: async function () {
        const connection = await pool.getConnection(async (conn) => conn);
        try {
            return connection;
        } catch (err) {
            console.log("DB connection error: " + err);
        }
    },
    query: async function (query, args) {
        let rows;
        const connection = await this.connection(async (conn) => conn);

        if (!args) {
            rows = await connection.query(query);
        } else {
            rows = await connection.query(query, args);
        }

        connection.release();

        return rows;
    },
};
