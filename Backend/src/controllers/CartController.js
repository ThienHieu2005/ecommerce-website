const CartService = require('../services/CartService')

const getCartByUser = async (req, res) => {
    try {
        const userId = parseInt(req.params.userId)

        if (!userId || isNaN(userId)) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Invalid userId'
            })
        }

        const response = await CartService.getCartByUser(userId)

        return res.status(200).json(response)
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            status: 'ERR',
            message: e.message
        })
    }
}

const addToCart = async (req, res) => {
    try {
        const { userId, productId, amount } = req.body

        if (!userId || !productId || !amount) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }

        const response = await CartService.addToCart(req.body)

        return res.status(200).json(response)
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            status: 'ERR',
            message: e.message
        })
    }
}

const updateCartAmount = async (req, res) => {
    try {
        const { userId, productId, amount } = req.body

        if (!userId || !productId || !amount) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }

        const response = await CartService.updateCartAmount(req.body)

        return res.status(200).json(response)
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            status: 'ERR',
            message: e.message
        })
    }
}

const removeCartItem = async (req, res) => {
    try {
        const { userId, productId } = req.body

        if (!userId || !productId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }

        const response = await CartService.removeCartItem(req.body)

        return res.status(200).json(response)
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            status: 'ERR',
            message: e.message
        })
    }
}

const deleteAllCartByUser = async (req, res) => {
    try {
        const { userId } = req.params

        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }

        const response = await CartService.deleteAllCartByUser(userId)

        return res.status(200).json(response)
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            status: 'ERR',
            message: e.message
        })
    }
}

module.exports = {
    getCartByUser,
    addToCart,
    updateCartAmount,
    removeCartItem,
    deleteAllCartByUser
}