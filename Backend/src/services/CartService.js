const sql = require("mssql");

const getCartByUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const pool = await sql.connect();

            const result = await pool.request()
                .input("UserId", sql.Int, Number(userId))
                .query(`
                    SELECT 
                        ci.ProductId AS product,
                        p.Name AS name,
                        p.Image AS image,
                        p.Price AS price,
                        p.Discount AS discount,
                        ci.Amount AS amount,
                        p.CountInStock AS countInStock
                    FROM dbo.Carts c
                    INNER JOIN dbo.CartItems ci ON c.Id = ci.CartId
                    INNER JOIN dbo.Products p ON ci.ProductId = p.Id
                    WHERE c.UserId = @UserId
                `);

            return resolve({
                status: "OK",
                message: "SUCCESS",
                orderItem: result.recordset
            });

        } catch (e) {
            console.error("GET CART SQL ERROR:", e);
            return reject({
                status: "ERR",
                message: e.message
            });
        }
    });
};

const addToCart = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { userId, productId, amount } = data;

            const pool = await sql.connect();

            const finalAmount = Number(amount);

            if (!userId || !productId || !finalAmount || finalAmount <= 0) {
                return resolve({
                    status: "ERR",
                    message: "The input is required"
                });
            }

            const checkProduct = await pool.request()
                .input("ProductId", sql.Int, Number(productId))
                .query(`
                    SELECT Id, CountInStock
                    FROM dbo.Products
                    WHERE Id = @ProductId
                `);

            const product = checkProduct.recordset[0];

            if (!product) {
                return resolve({
                    status: "ERR",
                    message: "Product not found"
                });
            }

            if (Number(product.CountInStock) < finalAmount) {
                return resolve({
                    status: "ERR",
                    message: "Product quantity is not enough"
                });
            }

            const cartResult = await pool.request()
                .input("UserId", sql.Int, Number(userId))
                .query(`
                    SELECT Id
                    FROM dbo.Carts
                    WHERE UserId = @UserId
                `);

            let cartId;

            if (cartResult.recordset.length === 0) {
                const createCartResult = await pool.request()
                    .input("UserId", sql.Int, Number(userId))
                    .query(`
                        INSERT INTO dbo.Carts (UserId, CreatedAt, UpdatedAt)
                        OUTPUT INSERTED.Id
                        VALUES (@UserId, SYSDATETIME(), SYSDATETIME())
                    `);

                cartId = createCartResult.recordset[0].Id;
            } else {
                cartId = cartResult.recordset[0].Id;
            }

            const checkCartItem = await pool.request()
                .input("CartId", sql.Int, Number(cartId))
                .input("ProductId", sql.Int, Number(productId))
                .query(`
                    SELECT Id, Amount
                    FROM dbo.CartItems
                    WHERE CartId = @CartId
                      AND ProductId = @ProductId
                `);

            if (checkCartItem.recordset.length > 0) {
                await pool.request()
                    .input("CartId", sql.Int, Number(cartId))
                    .input("ProductId", sql.Int, Number(productId))
                    .input("Amount", sql.Int, finalAmount)
                    .query(`
                        UPDATE dbo.CartItems
                        SET Amount = Amount + @Amount,
                            UpdatedAt = SYSDATETIME()
                        WHERE CartId = @CartId
                          AND ProductId = @ProductId
                    `);
            } else {
                await pool.request()
                    .input("CartId", sql.Int, Number(cartId))
                    .input("ProductId", sql.Int, Number(productId))
                    .input("Amount", sql.Int, finalAmount)
                    .query(`
                        INSERT INTO dbo.CartItems (
                            CartId,
                            ProductId,
                            Amount,
                            CreatedAt,
                            UpdatedAt
                        )
                        VALUES (
                            @CartId,
                            @ProductId,
                            @Amount,
                            SYSDATETIME(),
                            SYSDATETIME()
                        )
                    `);
            }

            await pool.request()
                .input("ProductId", sql.Int, Number(productId))
                .input("Amount", sql.Int, finalAmount)
                .query(`
                    UPDATE dbo.Products
                    SET CountInStock = CountInStock - @Amount,
                        UpdatedAt = SYSDATETIME()
                    WHERE Id = @ProductId
                `);

            return resolve({
                status: "OK",
                message: "Add to cart successfully"
            });

        } catch (e) {
            console.error("ADD TO CART SQL ERROR:", e);
            return reject({
                status: "ERR",
                message: e.message
            });
        }
    });
};

const updateCartAmount = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { userId, productId, amount } = data;

            const pool = await sql.connect();

            const finalAmount = Number(amount);

            if (!userId || !productId || !finalAmount || finalAmount <= 0) {
                return resolve({
                    status: "ERR",
                    message: "The input is required"
                });
            }

            const checkProduct = await pool.request()
                .input("ProductId", sql.Int, Number(productId))
                .query(`
                    SELECT Id, CountInStock
                    FROM dbo.Products
                    WHERE Id = @ProductId
                `);

            const product = checkProduct.recordset[0];

            if (!product) {
                return resolve({
                    status: "ERR",
                    message: "Product not found"
                });
            }

            if (finalAmount > Number(product.CountInStock)) {
                return resolve({
                    status: "ERR",
                    message: "Product quantity is not enough"
                });
            }

            const result = await pool.request()
                .input("UserId", sql.Int, Number(userId))
                .input("ProductId", sql.Int, Number(productId))
                .input("Amount", sql.Int, finalAmount)
                .query(`
                    UPDATE ci
                    SET ci.Amount = @Amount,
                        ci.UpdatedAt = SYSDATETIME()
                    FROM dbo.CartItems ci
                    INNER JOIN dbo.Carts c ON ci.CartId = c.Id
                    WHERE c.UserId = @UserId
                      AND ci.ProductId = @ProductId
                `);

            if (result.rowsAffected[0] === 0) {
                return resolve({
                    status: "ERR",
                    message: "Cart item not found"
                });
            }

            return resolve({
                status: "OK",
                message: "Update cart amount successfully"
            });

        } catch (e) {
            console.error("UPDATE CART AMOUNT SQL ERROR:", e);
            return reject({
                status: "ERR",
                message: e.message
            });
        }
    });
};

const removeCartItem = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { userId, productId } = data;

            const pool = await sql.connect();

            if (!userId || !productId) {
                return resolve({
                    status: "ERR",
                    message: "The input is required"
                });
            }

            const cartItemResult = await pool.request()
                .input("UserId", sql.Int, Number(userId))
                .input("ProductId", sql.Int, Number(productId))
                .query(`
                    SELECT ci.Amount
                    FROM dbo.CartItems ci
                    INNER JOIN dbo.Carts c ON ci.CartId = c.Id
                    WHERE c.UserId = @UserId
                      AND ci.ProductId = @ProductId
                `);

            const cartItem = cartItemResult.recordset[0];

            if (!cartItem) {
                return resolve({
                    status: "ERR",
                    message: "Cart item not found"
                });
            }

            const amount = Number(cartItem.Amount);

            await pool.request()
                .input("UserId", sql.Int, Number(userId))
                .input("ProductId", sql.Int, Number(productId))
                .query(`
                    DELETE ci
                    FROM dbo.CartItems ci
                    INNER JOIN dbo.Carts c ON ci.CartId = c.Id
                    WHERE c.UserId = @UserId
                      AND ci.ProductId = @ProductId
                `);

            await pool.request()
                .input("ProductId", sql.Int, Number(productId))
                .input("Amount", sql.Int, amount)
                .query(`
                    UPDATE dbo.Products
                    SET CountInStock = CountInStock + @Amount,
                        UpdatedAt = SYSDATETIME()
                    WHERE Id = @ProductId
                `);

            return resolve({
                status: "OK",
                message: "Remove cart item successfully"
            });

        } catch (e) {
            console.error("REMOVE CART ITEM SQL ERROR:", e);

            return reject({
                status: "ERR",
                message: e.message
            });
        }
    });
};

const deleteAllCartByUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const pool = await sql.connect();

            if (!userId) {
                return resolve({
                    status: "ERR",
                    message: "The userId is required"
                });
            }

            const result = await pool.request()
                .input("UserId", sql.Int, Number(userId))
                .query(`
                    DELETE ci
                    FROM dbo.CartItems ci
                    INNER JOIN dbo.Carts c ON ci.CartId = c.Id
                    WHERE c.UserId = @UserId
                `);

            if (result.rowsAffected[0] === 0) {
                return resolve({
                    status: "ERR",
                    message: "Cart is empty"
                });
            }

            return resolve({
                status: "OK",
                message: "Delete all cart items successfully"
            });

        } catch (e) {
            console.error("DELETE ALL CART SQL ERROR:", e);

            return reject({
                status: "ERR",
                message: e.message
            });
        }
    });
};

module.exports = {
    getCartByUser,
    addToCart,
    updateCartAmount,
    removeCartItem,
    deleteAllCartByUser
};