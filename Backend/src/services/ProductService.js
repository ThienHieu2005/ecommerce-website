const sql = require("mssql");

// ================= CREATE USER =================

const createProduct = (newProduct) => {
    return new Promise(async (resolve, reject) => {
        const {
            name,
            image,
            type,
            countInStock,
            price,
            rating,
            description,
            discount
        } = newProduct;

        try {
            const pool = await sql.connect();

            // 1. Check product tồn tại
            const checkProduct = await pool.request()
                .input("Name", sql.NVarChar, name)
                .query("SELECT * FROM Products WHERE Name = @Name");

            if (checkProduct.recordset.length > 0) {
                return resolve({
                    status: "ERR",
                    message: "Product name already exists",
                });
            }

            // 2. Insert product
            const result = await pool.request()
                .input("Name", sql.NVarChar, name)
                .input("Image", sql.NVarChar, image)
                .input("Type", sql.NVarChar, type)
                .input("Price", sql.Decimal(18, 2), price)
                .input("CountInStock", sql.Int, countInStock)
                .input("Rating", sql.Decimal(3, 2), rating)
                .input("Description", sql.NVarChar(sql.MAX), description)
                .input("Discount", sql.Decimal(5, 2), discount)
                .query(`
    INSERT INTO Products 
    (Name, Image, Type, Price, CountInStock, Rating, Description, Discount, CreatedAt, UpdatedAt)
    VALUES 
    (@Name, @Image, @Type, @Price, @CountInStock, @Rating, @Description, @Discount, GETDATE(), GETDATE())
  `);

            resolve({
                status: "OK",
                message: "Product created successfully",
            });

        } catch (e) {
            console.error("SQL ERROR:", e);
            reject({
                status: "ERR",
                message: e.message
            });
        }
    });
};


const updateProduct = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const pool = await sql.connect();

            // 1. Check product tồn tại
            const result = await pool.request()
                .input("id", sql.Int, id)
                .query(`
                    SELECT TOP 1 *
                    FROM Products
                    WHERE id = @id
                `);

            const checkProduct = result.recordset[0];

            if (!checkProduct) {
                return resolve({
                    status: "ERR",
                    message: "Product not found",
                });
            }

            // 2. Mapping FE -> DB fields
            const fieldMap = {
                name: "Name",
                image: "Image",
                type: "Type",
                price: "Price",
                countInStock: "CountInStock",
                rating: "Rating",
                description: "Description",
                discount: "Discount",
                selled: "Selled"
            };

            const allowedFields = {
                Name: sql.NVarChar,
                Image: sql.NVarChar,
                Type: sql.NVarChar,
                Price: sql.Decimal(18, 2),
                CountInStock: sql.Int,
                Rating: sql.Decimal(3, 2),
                Description: sql.NVarChar,
                Discount: sql.Decimal(5, 2),
                Selled: sql.Int
            };

            const request = pool.request();
            request.input("id", sql.Int, id);

            let updateFields = [];

            for (const key in data) {
                const dbField = fieldMap[key];

                if (dbField && data[key] !== undefined) {
                    request.input(dbField, allowedFields[dbField], data[key]);
                    updateFields.push(`${dbField} = @${dbField}`);
                }
            }

            // luôn update thời gian
            updateFields.push(`UpdatedAt = GETDATE()`);

            if (updateFields.length === 1) {
                return resolve({
                    status: "ERR",
                    message: "No valid data to update",
                });
            }

            await request.query(`
                UPDATE Products
                SET ${updateFields.join(", ")}
                WHERE id = @id
            `);

            // 3. Get updated product
            const updateResult = await pool.request()
                .input("id", sql.Int, id)
                .query(`SELECT * FROM Products WHERE id = @id`);

            return resolve({
                status: "OK",
                message: "SUCCESS",
                data: updateResult.recordset[0],
            });

        } catch (e) {
            console.error("SQL ERROR:", e);
            reject(e);
        }
    });
};

const getDetailProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const pool = await sql.connect();

            // 1. Check product tồn tại
            const result = await pool.request()
                .input("id", sql.Int, id)
                .query(`
                    SELECT TOP 1 *
                    FROM Products
                    WHERE id = @id
                `);

            const product = result.recordset[0];

            if (!product) {
                return resolve({
                    status: "ERR",
                    message: "product not found",
                });
            }


            return resolve({
                status: "OK",
                message: "SUCCESS",
                data: product
            });

        } catch (e) {
            console.error("SQL ERROR:", e);
            reject(e);
        }
    });
};

const deleteProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const pool = await sql.connect();

            // 1. Check product tồn tại
            const result = await pool.request()
                .input("id", sql.Int, id)
                .query(`
                    SELECT TOP 1 *
                    FROM Products
                    WHERE id = @id
                `);

            const product = result.recordset[0];

            if (!product) {
                return resolve({
                    status: "ERR",
                    message: "product not found",
                });
            }

            // 2. Delete user
            await pool.request()
                .input("id", sql.Int, id)
                .query(`
                    DELETE FROM Products
                    WHERE id = @id
                `);

            return resolve({
                status: "OK",
                message: "DELETE PRODUCT SUCCESS",
            });

        } catch (e) {
            console.error("SQL ERROR:", e);
            reject(e);
        }
    });
};

const getAllProduct = (limit, page, sort, filter) => {
    return new Promise(async (resolve, reject) => {
        try {
            const pool = await sql.connect();

            const pageNumber = Number(page) > 0 ? Number(page) : 1;


            const limitNumber = Number(limit) > 0 ? Number(limit) : 100;

            const offset = (pageNumber - 1) * limitNumber;


            const fieldMap = {
                id: 'Id',
                name: 'Name',
                type: 'Type',
                price: 'Price',
                rating: 'Rating',
                description: 'Description'
            };

            let whereClause = '';
            let orderBy = 'Id ASC';


            let field = null;
            let value = null;

            if (Array.isArray(filter)) {
                field = filter[0];
                value = filter[1];
            } else if (typeof filter === 'string') {
                const parts = filter.split(',');
                field = parts[0];
                value = parts[1];
            }

            const dbField = fieldMap[field?.toLowerCase()];

            const isValidFilter =
                dbField &&
                value &&
                value.trim() !== '';

            if (isValidFilter) {
                whereClause = `WHERE ${dbField} LIKE @filterValue`;
            }


            if (sort) {
                let sortField = null;
                let sortOrder = 'ASC';

                if (Array.isArray(sort)) {
                    sortField = sort[1];
                    sortOrder =
                        (sort[0] == -1 || sort[0] === 'DESC')
                            ? 'DESC'
                            : 'ASC';
                } else if (typeof sort === 'string') {
                    const [order, fieldName] = sort.split(',');

                    sortField = fieldName;

                    sortOrder =
                        (order == -1 || order === 'DESC')
                            ? 'DESC'
                            : 'ASC';
                }

                const dbSortField =
                    fieldMap[sortField?.toLowerCase()];

                if (dbSortField) {
                    orderBy = `${dbSortField} ${sortOrder}`;
                }
            }

            const countRequest = pool.request();

            if (isValidFilter) {
                countRequest.input(
                    'filterValue',
                    sql.NVarChar,
                    `%${value}%`
                );
            }

            const countQuery = `
                SELECT COUNT(*) AS total
                FROM Products
                ${whereClause}
            `;

            const totalResult =
                await countRequest.query(countQuery);

            const totalProduct =
                totalResult.recordset[0].total;

            const totalPage =
                Math.ceil(totalProduct / limitNumber);


            const dataRequest = pool.request()
                .input('offset', sql.Int, offset)
                .input('limit', sql.Int, limitNumber);

            if (isValidFilter) {
                dataRequest.input(
                    'filterValue',
                    sql.NVarChar,
                    `%${value}%`
                );
            }

            const dataQuery = `
                SELECT *
                FROM Products
                ${whereClause}
                ORDER BY ${orderBy}
                OFFSET @offset ROWS
                FETCH NEXT @limit ROWS ONLY
            `;

            const result =
                await dataRequest.query(dataQuery);


            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: result.recordset,
                total: totalProduct,
                pageCurrent: pageNumber,
                totalPage: totalPage
            });

        } catch (e) {
            console.error('SQL ERROR:', e);
            reject(e);
        }
    });
};

const getAllType = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const pool = await sql.connect()

            const result = await pool.request().query(`
                SELECT DISTINCT Type FROM Products
            `)

            resolve({
                status: 'OK',
                message: 'Success',
                data: result.recordset,
            })
        } catch (e) {
            reject(e)
        }
    })
}
module.exports = {
    createProduct,
    updateProduct,
    getDetailProduct,
    deleteProduct,
    getAllProduct,
    getAllType
};