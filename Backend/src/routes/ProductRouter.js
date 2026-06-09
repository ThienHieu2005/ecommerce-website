const express = require('express')
const router = express.Router()
const ProductController = require('../controllers/ProductController')

const {
    authAdminMiddleWare
} = require('../middlewares/authMiddleware')

router.post('/create', authAdminMiddleWare, ProductController.createProduct)

router.put('/update/:id', authAdminMiddleWare, ProductController.updateProduct)

router.get('/get-details/:id', ProductController.getDetailProduct)

router.delete('/delete/:id', authAdminMiddleWare, ProductController.deleteProduct)

router.get('/get-all', ProductController.getAllProduct)

router.get('/get-all-type', ProductController.getAllType)

module.exports = router