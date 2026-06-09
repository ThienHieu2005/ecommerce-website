const jwt = require('jsonwebtoken')

const authMiddleWare = (req, res, next) => {
    const token = req.headers.token?.split(' ')[1]

    if (!token) {
        return res.status(401).json({
            status: 'ERR',
            message: 'Token is required'
        })
    }

    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
            return res.status(401).json({
                status: 'ERR',
                message: 'Authentication failed'
            })
        }

        req.user = user
        next()
    })
}

const authAdminMiddleWare = (req, res, next) => {
    authMiddleWare(req, res, () => {
        if (req.user?.isAdmin) {
            next()
        } else {
            return res.status(403).json({
                status: 'ERR',
                message: 'Only admin can access'
            })
        }
    })
}

module.exports = {
    authMiddleWare,
    authAdminMiddleWare
}