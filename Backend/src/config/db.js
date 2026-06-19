const sql = require('mssql');

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    port: Number(process.env.DB_PORT),
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};
// Ghi đè sql.connect để tránh lỗi TypeError khi gọi sql.connect() không truyền tham số ở các service
const originalConnect = sql.connect;
sql.connect = function (cfg) {
    return originalConnect.call(sql, cfg || config);
};

const connectDB = async () => {
    try {
        await sql.connect(config);
        console.log("Kết nối DB thành công");
    } catch (err) {
        console.log("Lỗi kết nối DB:", err);
    }
};

module.exports = connectDB;