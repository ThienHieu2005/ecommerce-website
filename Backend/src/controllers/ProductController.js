const ProductService = require('../services/ProductService')

const createProduct = async (req, res) => {
    try {
        const { name, image, type, countInStock, price, rating, description } = req.body;

        // Validate input
        if (!name || !image || !type || !countInStock || !price || !rating) {
            return res.status(400).json({
                status: "ERR",
                message: "All fields are required",
            });
        }




        const response = await ProductService.createProduct(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const updateProduct = async (req, res) => {
    try {
        const productId = parseInt(req.params.id)
        const data = req.body

        if (!productId || isNaN(productId)) {
            return res.status(400).json({
                status: "ERR",
                message: "Invalid productId",
            });
        }

        const response = await ProductService.updateProduct(productId, data)

        return res.status(200).json(response)

    } catch (e) {
        console.error(e)

        return res.status(500).json({
            status: "ERR",
            message: e.message
        })
    }
}

const getDetailProduct = async (req, res) => {
    try {
        const productId = parseInt(req.params.id)


        if (!productId || isNaN(productId)) {
            return res.status(400).json({
                status: "ERR",
                message: "Invalid productId",
            });
        }


        const response = await ProductService.getDetailProduct(productId)

        return res.status(200).json(response)

    } catch (e) {
        console.error(e)

        return res.status(500).json({
            status: "ERR",
            message: e.message
        })
    }
}

const deleteProduct = async (req, res) => {
    try {
        const productId = parseInt(req.params.id)


        if (!productId || isNaN(productId)) {
            return res.status(400).json({
                status: "ERR",
                message: "Invalid productId",
            });
        }


        const response = await ProductService.deleteProduct(productId)

        return res.status(200).json(response)

    } catch (e) {
        console.error(e)

        return res.status(500).json({
            status: "ERR",
            message: e.message
        })
    }
}


const getAllProduct = async (req, res) => {
    try {
        const { limit, page, sort, filter } = req.query


        const response = await ProductService.getAllProduct(Number(limit) || 8, Number(page) || 0, sort, filter)

        return res.status(200).json(response)

    } catch (e) {
        console.error(e)

        return res.status(500).json({
            status: "ERR",
            message: e.message
        })
    }
}

const getAllType = async (req, res) => {
    try {

        const response = await ProductService.getAllType()

        return res.status(200).json(response)

    } catch (e) {
        console.error(e)

        return res.status(500).json({
            status: "ERR",
            message: e.message
        })
    }
}

module.exports = {
    createProduct,
    updateProduct,
    getDetailProduct,
    deleteProduct,
    getAllProduct,
    getAllType
}