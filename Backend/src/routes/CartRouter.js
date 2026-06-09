const express = require('express')
const router = express.Router()
const CartController = require('../controllers/CartController')

const {
    authMiddleWare
} = require('../middlewares/authMiddleware')

router.get('/:userId', authMiddleWare, CartController.getCartByUser)

router.post('/add', authMiddleWare, CartController.addToCart)

router.put('/update-amount', authMiddleWare, CartController.updateCartAmount)

router.delete('/remove', authMiddleWare, CartController.removeCartItem)

router.delete('/delete-all/:userId', authMiddleWare, CartController.deleteAllCartByUser)

module.exports = router