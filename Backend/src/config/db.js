const sql = require('mssql');

const config = {
    user: 'sa',
    password: 'hieu',
    server: 'localhost',
    database: 'ECOMMERCE',
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

// Hàm kết nối
const connectDB = async () => {
    try {
        await sql.connect(config);
        console.log('Kết nối DB thành công');
    } catch (err) {
        console.log('Lỗi kết nối DB:', err);
    }
};

module.exports = connectDB;