const express = require('express')
const router = express.Router()
const OrderController = require('../controllers/OrderController')

const {
    authMiddleWare,
    authAdminMiddleWare
} = require('../middlewares/authMiddleware')

router.post('/create', authMiddleWare, OrderController.createOrder)

router.get('/get-order-details/:id', authMiddleWare, OrderController.getOrderDetails)

router.delete('/cancel-order/:id', authMiddleWare, OrderController.cancelOrderDetails)

router.get('/get-all-order', authAdminMiddleWare, OrderController.getAllOrder)

router.put('/update-order/:id', authAdminMiddleWare, OrderController.updateOrder)

module.exports = router