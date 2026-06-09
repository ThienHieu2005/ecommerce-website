const sql = require("mssql");

const createOrder = (newOrder) => {
    return new Promise(async (resolve, reject) => {
        console.log("newOrder:", newOrder);

        const {
            orderItems,
            paymentMethod,
            itemsPrice,
            shippingPrice,
            totalPrice,
            fullName,
            address,
            city,
            phone,
            user,
            userId,
            isPaid
        } = newOrder;

        const finalUserId = user || userId;

        try {
            if (!finalUserId) {
                throw new Error("Thiếu UserId");
            }

            if (!orderItems || orderItems.length === 0) {
                throw new Error("Thiếu orderItems");
            }

            if (!fullName || !address || !city || !phone || !paymentMethod) {
                throw new Error("Thiếu thông tin giao hàng hoặc paymentMethod");
            }

            if (itemsPrice == null || shippingPrice == null || totalPrice == null) {
                throw new Error("Thiếu itemsPrice, shippingPrice hoặc totalPrice");
            }

            const finalIsPaid = Boolean(isPaid);

            const request = new sql.Request();

            request.input("UserId", sql.Int, Number(finalUserId));
            request.input("ShippingFullName", sql.NVarChar(255), fullName);
            request.input("ShippingAddress", sql.NVarChar(500), address);
            request.input("ShippingCity", sql.NVarChar(255), city);
            request.input("ShippingPhone", sql.NVarChar(20), phone);
            request.input("PaymentMethod", sql.NVarChar(100), paymentMethod);
            request.input("ItemsPrice", sql.Decimal(18, 2), Number(itemsPrice));
            request.input("ShippingPrice", sql.Decimal(18, 2), Number(shippingPrice));
            request.input("TotalPrice", sql.Decimal(18, 2), Number(totalPrice));
            request.input("IsPaid", sql.Bit, finalIsPaid);

            const result = await request.query(`
                INSERT INTO dbo.Orders (
                    UserId,
                    ShippingFullName,
                    ShippingAddress,
                    ShippingCity,
                    ShippingPhone,
                    PaymentMethod,
                    ItemsPrice,
                    ShippingPrice,
                    TotalPrice,
                    IsPaid,
                    PaidAt,
                    IsDelivered,
                    DeliveredAt,
                    CreatedAt,
                    UpdatedAt
                )
                OUTPUT INSERTED.*
                VALUES (
                    @UserId,
                    @ShippingFullName,
                    @ShippingAddress,
                    @ShippingCity,
                    @ShippingPhone,
                    @PaymentMethod,
                    @ItemsPrice,
                    @ShippingPrice,
                    @TotalPrice,
                    @IsPaid,
                    CASE 
                        WHEN @IsPaid = 1 THEN SYSDATETIME()
                        ELSE NULL
                    END,
                    0,
                    NULL,
                    SYSDATETIME(),
                    SYSDATETIME()
                )
            `);

            const createdOrder = result.recordset[0];

            for (const item of orderItems) {
                await new sql.Request()
                    .input("OrderId", sql.Int, createdOrder.Id)
                    .input("ProductId", sql.Int, item.product)
                    .input("Name", sql.NVarChar(255), item.name)
                    .input("Amount", sql.Int, item.amount)
                    .input("Image", sql.NVarChar(sql.MAX), item.image)
                    .input("Price", sql.Decimal(18, 2), Number(item.price))
                    .input("Discount", sql.Decimal(5, 2), Number(item.discount || 0))
                    .query(`
                        INSERT INTO dbo.OrderItems (
                            OrderId,
                            ProductId,
                            Name,
                            Amount,
                            Image,
                            Price,
                            Discount
                        )
                        VALUES (
                            @OrderId,
                            @ProductId,
                            @Name,
                            @Amount,
                            @Image,
                            @Price,
                            @Discount
                        )
                    `);
            }

            return resolve({
                status: "OK",
                message: "SUCCESS",
                data: createdOrder
            });

        } catch (e) {
            console.error("CREATE ORDER SQL ERROR:", e);

            return reject({
                status: "ERR",
                message: e.message
            });
        }
    });
};


const getOrderDetails = (userId, page = 1, limit = 5) => {
    return new Promise(async (resolve, reject) => {
        try {
            const pool = await sql.connect();

            const offset = (page - 1) * limit;

            // 1. Đếm tổng số đơn hàng
            const totalResult = await pool.request()
                .input("userId", sql.Int, userId)
                .query(`
                    SELECT COUNT(*) AS total
                    FROM Orders
                    WHERE UserId = @userId
                `);

            const total = totalResult.recordset[0].total;

            // 2. Lấy danh sách orders có phân trang
            const orderResult = await pool.request()
                .input("userId", sql.Int, userId)
                .input("offset", sql.Int, offset)
                .input("limit", sql.Int, limit)
                .query(`
                    SELECT *
                    FROM Orders
                    WHERE UserId = @userId
                    ORDER BY CreatedAt DESC
                    OFFSET @offset ROWS
                    FETCH NEXT @limit ROWS ONLY
                `);

            const orders = orderResult.recordset;

            if (!orders || orders.length === 0) {
                return resolve({
                    status: "OK",
                    message: "No orders found for this user",
                    data: [],
                    total: 0,
                    currentPage: page,
                    totalPage: 1
                });
            }

            const orderIds = orders.map(order => order.Id);

            // 3. Lấy order items theo các order đang hiển thị
            const itemResult = await pool.request()
                .query(`
                    SELECT *
                    FROM OrderItems
                    WHERE OrderId IN (${orderIds.join(",")})
                `);

            const orderItems = itemResult.recordset;

            const ordersWithItems = orders.map(order => ({
                ...order,
                orderItems: orderItems.filter(item => item.OrderId === order.Id)
            }));

            return resolve({
                status: "OK",
                message: "SUCCESS",
                data: ordersWithItems,
                total,
                currentPage: page,
                totalPage: Math.ceil(total / limit)
            });

        } catch (e) {
            console.error("SQL ERROR:", e);
            reject(e);
        }
    });
};


const cancelOrderDetails = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const pool = await sql.connect();

            const checkOrder = await pool.request()
                .input("Id", sql.Int, id)
                .query(`
                    SELECT *
                    FROM dbo.Orders
                    WHERE Id = @Id
                `);

            const order = checkOrder.recordset[0];

            if (!order) {
                return resolve({
                    status: "ERR",
                    message: "The order is not defined"
                });
            }

            // Lấy sản phẩm trong đơn trước khi xóa
            const orderItemsResult = await pool.request()
                .input("OrderId", sql.Int, id)
                .query(`
                    SELECT ProductId, Amount
                    FROM dbo.OrderItems
                    WHERE OrderId = @OrderId
                `);

            const orderItems = orderItemsResult.recordset;

            // Cộng lại CountInStock và giảm Selled
            for (const item of orderItems) {
                await pool.request()
                    .input("ProductId", sql.Int, item.ProductId)
                    .input("Amount", sql.Int, item.Amount)
                    .query(`
                        UPDATE dbo.Products
                        SET
                            CountInStock = CountInStock + @Amount,
                            Selled = CASE
                                WHEN ISNULL(Selled, 0) - @Amount < 0 THEN 0
                                ELSE ISNULL(Selled, 0) - @Amount
                            END,
                            UpdatedAt = SYSDATETIME()
                        WHERE Id = @ProductId
                    `);
            }

            await pool.request()
                .input("OrderId", sql.Int, id)
                .query(`
                    DELETE FROM dbo.OrderItems
                    WHERE OrderId = @OrderId
                `);

            await pool.request()
                .input("Id", sql.Int, id)
                .query(`
                    DELETE FROM dbo.Orders
                    WHERE Id = @Id
                `);

            return resolve({
                status: "OK",
                message: "SUCCESS",
                data: order
            });

        } catch (e) {
            console.log("CANCEL ORDER SQL ERROR:", e);
            reject(e);
        }
    });
};


const getAllOrder = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const pool = await sql.connect();

            const result = await pool.request().query(`
                SELECT * FROM Orders
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

const updateOrder = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const pool = await sql.connect();

            let { isPaid, isDelivered } = data;

            isPaid = Boolean(Number(isPaid));
            isDelivered = Boolean(Number(isDelivered));

            const checkOrder = await pool.request()
                .input("Id", sql.Int, id)
                .query(`
                    SELECT *
                    FROM dbo.Orders
                    WHERE Id = @Id
                `);

            const order = checkOrder.recordset[0];

            if (!order) {
                return resolve({
                    status: 'ERR',
                    message: 'Không tìm thấy đơn hàng'
                });
            }

            await pool.request()
                .input("Id", sql.Int, id)
                .input("IsPaid", sql.Bit, isPaid)
                .input("IsDelivered", sql.Bit, isDelivered)
                .query(`
                    UPDATE dbo.Orders
                    SET
                        IsPaid = @IsPaid,
                        PaidAt = CASE 
                            WHEN @IsPaid = 1 THEN ISNULL(PaidAt, SYSDATETIME())
                            ELSE NULL
                        END,
                        IsDelivered = @IsDelivered,
                        DeliveredAt = CASE 
                            WHEN @IsDelivered = 1 THEN ISNULL(DeliveredAt, SYSDATETIME())
                            ELSE NULL
                        END,
                        UpdatedAt = SYSDATETIME()
                    WHERE Id = @Id
                `);

            const result = await pool.request()
                .input("Id", sql.Int, id)
                .query(`
                    SELECT *
                    FROM dbo.Orders
                    WHERE Id = @Id
                `);

            return resolve({
                status: 'OK',
                message: 'Cập nhật đơn hàng thành công',
                data: result.recordset[0]
            });

        } catch (e) {
            console.error("UPDATE ORDER SQL ERROR:", e);
            reject(e);
        }
    });
};

const updatePaidOrder = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const pool = await sql.connect();

            const checkOrder = await pool.request()
                .input("Id", sql.Int, id)
                .query(`
                    SELECT *
                    FROM dbo.Orders
                    WHERE Id = @Id
                `);

            const order = checkOrder.recordset[0];

            if (!order) {
                return resolve({
                    status: 'ERR',
                    message: 'Không tìm thấy đơn hàng'
                });
            }

            await pool.request()
                .input("Id", sql.Int, id)
                .query(`
                    UPDATE dbo.Orders
                    SET
                        IsPaid = 1,
                        PaidAt = ISNULL(PaidAt, SYSDATETIME()),
                        UpdatedAt = SYSDATETIME()
                    WHERE Id = @Id
                `);

            return resolve({
                status: 'OK',
                message: 'Cập nhật thanh toán thành công'
            });

        } catch (e) {
            console.error("UPDATE PAID ORDER SQL ERROR:", e);
            reject(e);
        }
    });
};
module.exports = {
    createOrder,
    getOrderDetails,
    cancelOrderDetails,
    getAllOrder,
    updateOrder,
    updatePaidOrder
};