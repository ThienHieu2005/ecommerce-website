const OrderService = require('../services/OrderService')

const createOrder = async (req, res) => {
    try {
        console.log('API HIT'); // 🔥 1

        const { paymentMethod, itemsPrice, shippingPrice, totalPrice, fullName, address, city, phone } = req.body

        if (!paymentMethod || itemsPrice == null || shippingPrice == null || totalPrice == null || !fullName || !address || !city || !phone) {
            console.log('VALIDATION FAIL'); // 🔥 2
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }

        console.log('CALL SERVICE'); // 🔥 3

        const response = await OrderService.createOrder(req.body)

        console.log('SERVICE DONE', response); // 🔥 4

        return res.status(200).json(response)
    } catch (e) {
        console.log('ERROR', e); // 🔥 5
        return res.status(500).json({
            message: e.message
        })
    }
}
const getOrderDetails = async (req, res) => {
    try {
        const userId = parseInt(req.params.id)

        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 5

        if (!userId || isNaN(userId)) {
            return res.status(400).json({
                status: "ERR",
                message: "Invalid userId",
            });
        }

        const response = await OrderService.getOrderDetails(
            userId,
            page,
            limit
        )

        return res.status(200).json(response)

    } catch (e) {
        console.error(e)

        return res.status(500).json({
            status: "ERR",
            message: e.message
        })
    }
}

const cancelOrderDetails = async (req, res) => {
    try {
        const orderId = req.params.id
        if (!orderId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }

        const response = await OrderService.cancelOrderDetails(orderId)
        return res.status(200).json(response)
    } catch (e) {
        console.log(e)
        return res.status(404).json({
            message: e
        })
    }
}

const getAllOrder = async (req, res) => {
    try {

        const response = await OrderService.getAllOrder()

        return res.status(200).json(response)

    } catch (e) {
        console.error(e)

        return res.status(500).json({
            status: "ERR",
            message: e.message
        })
    }
}

const updateOrder = async (req, res) => {
    try {
        const orderId = req.params.id

        const isPaid = Boolean(Number(req.body.isPaid))
        const isDelivered = Boolean(Number(req.body.isDelivered))

        if (!orderId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Order ID is required'
            })
        }

        const response = await OrderService.updateOrder(orderId, {
            isPaid,
            isDelivered
        })

        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message
        })
    }
}
module.exports = {
    createOrder,
    getOrderDetails,
    cancelOrderDetails,
    getAllOrder,
    updateOrder
}