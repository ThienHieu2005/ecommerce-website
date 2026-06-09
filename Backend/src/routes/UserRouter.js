const express = require('express')
const router = express.Router()
const userController = require('../controllers/UserController')

const {
    authMiddleWare,
    authAdminMiddleWare
} = require('../middlewares/authMiddleware')

router.post('/sign-up', userController.createUser)

router.post('/sign-in', userController.loginUser)

router.put('/change-password/:id', authMiddleWare, userController.changePasswordUser)

router.post('/log-out', userController.logoutUser)

router.put('/update-user/:id', authMiddleWare, userController.updateUser)

router.delete('/delete-user/:id', authAdminMiddleWare, userController.deleteUser)

router.get('/getAll', authAdminMiddleWare, userController.getAllUser)

router.get('/get-details/:id', authMiddleWare, userController.getDetailsUser)

module.exports = router