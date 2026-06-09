const sql = require("mssql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ================= CREATE USER =================

const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const { name, email, password, confirmPassword, phone } = newUser;

        try {
            const pool = await sql.connect();

            // 1. Check email tồn tại
            const checkUser = await pool.request()
                .input("Email", sql.NVarChar, email)
                .query("SELECT * FROM Users WHERE Email = @Email");

            if (checkUser.recordset.length > 0) {
                return resolve({
                    status: "ERR",
                    message: "Email already exists",
                });
            }

            // 2. Insert user
            await pool.request()
                .input("Name", sql.NVarChar, name)
                .input("Email", sql.NVarChar, email)
                .input("Password", sql.NVarChar, password)
                .input("Phone", sql.NVarChar, phone)
                .input("IsAdmin", sql.Bit, 0)
                .query(`
                    INSERT INTO Users (Name, Email, Password, Phone, IsAdmin, CreatedAt)
                    VALUES (@Name, @Email, @Password, @Phone, @IsAdmin, GETDATE())
                `);

            return resolve({
                status: "OK",
                message: "SUCCESS",
            });

        } catch (e) {
            console.error("SQL ERROR:", e);
            reject(e);
        }
    });
};



const loginUser = (userLogin) => {
    return new Promise(async (resolve, reject) => {
        const { email, password } = userLogin;

        try {
            const pool = await sql.connect();

            // Check email
            const checkUser = await pool.request()
                .input("Email", sql.NVarChar, email)
                .query("SELECT * FROM Users WHERE Email = @Email");

            if (checkUser.recordset.length === 0) {
                return resolve({
                    status: "ERR",
                    message: "Email is not defined",
                });
            }

            const user = checkUser.recordset[0];

            // Compare password đã hash
            const isMatch = await bcrypt.compare(password, user.Password);

            if (!isMatch) {
                return resolve({
                    status: "ERR",
                    message: "Password is incorrect",
                });
            }

            const access_token = jwt.sign(
                {
                    id: user.Id,
                    isAdmin: user.IsAdmin
                },
                process.env.ACCESS_TOKEN,
                {
                    expiresIn: "1d"
                }
            );

            return resolve({
                status: "OK",
                message: "SUCCESS",
                access_token,
                data: user,
            });

        } catch (e) {
            console.error("SQL ERROR:", e);
            reject(e);
        }
    });
};



const changePasswordUser = (userId, oldPassword, newPassword) => {
    return new Promise(async (resolve, reject) => {
        try {
            const pool = await sql.connect();

            // 1. Tìm user
            const result = await pool.request()
                .input("Id", sql.Int, userId)
                .query(`
                    SELECT TOP 1 *
                    FROM Users
                    WHERE Id = @Id
                `);

            const user = result.recordset[0];

            if (!user) {
                return resolve({
                    status: "ERR",
                    message: "User not found"
                });
            }

            // 2. So sánh password cũ
            const isMatch = await bcrypt.compare(
                oldPassword,
                user.Password
            );

            if (!isMatch) {
                return resolve({
                    status: "ERR",
                    message: "Current password is incorrect"
                });
            }

            // 3. Hash password mới
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // 4. Update password mới
            await pool.request()
                .input("Id", sql.Int, userId)
                .input("Password", sql.NVarChar, hashedPassword)
                .query(`
                    UPDATE Users
                    SET Password = @Password
                    WHERE Id = @Id
                `);

            return resolve({
                status: "OK",
                message: "Change password successfully"
            });

        } catch (e) {
            console.error("SQL ERROR:", e);
            reject(e);
        }
    });
};
const updateUser = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const pool = await sql.connect();

            // 1. Check user tồn tại
            const result = await pool.request()
                .input("id", sql.Int, id)
                .query(`
                    SELECT TOP 1 *
                    FROM Users
                    WHERE id = @id
                `);

            const checkUser = result.recordset[0];

            if (!checkUser) {
                return resolve({
                    status: "ERR",
                    message: "User not found",
                });
            }

            // 2. Dynamic update
            const request = pool.request();
            request.input("id", sql.Int, id);

            const allowedFields = {
                name: { type: sql.NVarChar, column: 'Name' },
                email: { type: sql.NVarChar, column: 'Email' },
                phone: { type: sql.NVarChar, column: 'Phone' },
                address: { type: sql.NVarChar, column: 'Address' },
                city: { type: sql.NVarChar, column: 'City' },
                avatar: { type: sql.NVarChar, column: 'Avatar' },
                isAdmin: { type: sql.Bit, column: 'IsAdmin' },
            };

            let updateFields = [];

            for (const key in data) {
                if (allowedFields[key] && data[key] !== undefined) {
                    request.input(key, allowedFields[key].type, data[key]);
                    updateFields.push(`${allowedFields[key].column} = @${key}`);
                }
            }

            if (updateFields.length === 0) {
                return resolve({
                    status: "ERR",
                    message: "No valid data to update",
                });
            }

            await request.query(`
                UPDATE Users
                SET ${updateFields.join(", ")}
                WHERE Id = @id
            `);

            // 3. Get updated user
            const updateResult = await pool.request()
                .input("Id", sql.Int, id)
                .query(`SELECT * FROM Users WHERE Id = @id`);

            const updatedUser = updateResult.recordset[0];

            return resolve({
                status: "OK",
                message: "SUCCESS",
                data: updatedUser,
            });

        } catch (e) {
            console.error("SQL ERROR:", e);
            reject(e);
        }
    });
};

const deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const pool = await sql.connect();

            const result = await pool.request()
                .input("id", sql.Int, id)
                .query(`
                    SELECT TOP 1 *
                    FROM Users
                    WHERE Id = @id
                `);

            const checkUser = result.recordset[0];

            if (!checkUser) {
                return resolve({
                    status: "ERR",
                    message: "User not found",
                });
            }

            // 1. Xóa chi tiết đơn hàng trước
            await pool.request()
                .input("id", sql.Int, id)
                .query(`
                    DELETE FROM OrderItems
                    WHERE OrderId IN (
                        SELECT Id FROM Orders WHERE UserId = @id
                    )
                `);

            // 2. Xóa đơn hàng
            await pool.request()
                .input("id", sql.Int, id)
                .query(`
                    DELETE FROM Orders
                    WHERE UserId = @id
                `);

            // 3. Xóa giỏ hàng
            await pool.request()
                .input("id", sql.Int, id)
                .query(`
                    DELETE FROM Carts
                    WHERE UserId = @id
                `);

            // 4. Xóa user
            await pool.request()
                .input("id", sql.Int, id)
                .query(`
                    DELETE FROM Users
                    WHERE Id = @id
                `);

            return resolve({
                status: "OK",
                message: "DELETE USER SUCCESS",
            });

        } catch (e) {
            console.error("SQL ERROR:", e);
            reject(e);
        }
    });
};
const getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const pool = await sql.connect();

            const result = await pool.request().query(`
                SELECT * FROM Users
            `);

            return resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: result.recordset
            });

        } catch (e) {
            console.error("SQL ERROR:", e);
            reject(e);
        }
    });
};

const getDetailsUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const pool = await sql.connect();

            // 1. Check user tồn tại
            const result = await pool.request()
                .input("id", sql.Int, id)
                .query(`
                    SELECT TOP 1 *
                    FROM Users
                    WHERE id = @id
                `);

            const user = result.recordset[0];

            if (!user) {
                return resolve({
                    status: "ERR",
                    message: "User not found",
                });
            }


            return resolve({
                status: "OK",
                message: "SUCCESS",
                data: user
            });

        } catch (e) {
            console.error("SQL ERROR:", e);
            reject(e);
        }
    });
};

module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
    changePasswordUser
};