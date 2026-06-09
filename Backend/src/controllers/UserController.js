const UserService = require('../services/UserService')
const bcrypt = require("bcrypt");

const createUser = async (req, res) => {
    try {
        const { email, password, confirmPassword } = req.body;

        const reg = /^\w+([-.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        const isCheckEmail = reg.test(email);

        if (!email || !password || !confirmPassword) {
            return res.status(400).json({
                status: "ERR",
                message: "All fields are required",
            });
        }

        if (!isCheckEmail) {
            return res.status(400).json({
                status: "ERR",
                message: "Invalid email format",
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                status: "ERR",
                message: "Password and confirmPassword do not match",
            });
        }

        // HASH PASSWORD 
        const hashedPassword = await bcrypt.hash(password, 10);

        const response = await UserService.createUser({
            ...req.body,
            password: hashedPassword
        });

        return res.status(200).json(response);

    } catch (e) {
        return res.status(500).json({
            message: e.message || e
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const reg = /^\w+([-.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        const isCheckEmail = reg.test(email);

        if (!email || !password) {
            return res.status(200).json({
                status: "ERR",
                message: "All fields are required",
            });
        }

        if (!isCheckEmail) {
            return res.status(200).json({
                status: "ERR",
                message: "Invalid email format",
            });
        }

        const response = await UserService.loginUser(req.body);

        return res.status(200).json(response);

    } catch (e) {
        return res.status(500).json({
            status: "ERR",
            message: e.message
        });
    }
}

const changePasswordUser = async (req, res) => {
    try {
        const userId = parseInt(req.params.id)
        const { oldPassword, newPassword, confirmNewPassword } = req.body

        if (!userId || isNaN(userId)) {
            return res.status(400).json({
                status: "ERR",
                message: "Invalid userId",
            })
        }

        if (!oldPassword || !newPassword || !confirmNewPassword) {
            return res.status(400).json({
                status: "ERR",
                message: "All fields are required",
            })
        }

        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({
                status: "ERR",
                message: "New password and confirm password do not match",
            })
        }

        const response = await UserService.changePasswordUser(
            userId,
            oldPassword,
            newPassword
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
const updateUser = async (req, res) => {
    try {
        const userId = parseInt(req.params.id)
        const data = req.body

        if (!userId || isNaN(userId)) {
            return res.status(400).json({
                status: "ERR",
                message: "Invalid userId",
            });
        }


        const response = await UserService.updateUser(userId, data)

        return res.status(200).json(response)

    } catch (e) {
        console.error(e)

        return res.status(500).json({
            status: "ERR",
            message: e.message
        })
    }
}

const deleteUser = async (req, res) => {
    try {
        const userId = parseInt(req.params.id)


        if (!userId || isNaN(userId)) {
            return res.status(400).json({
                status: "ERR",
                message: "Invalid userId",
            });
        }


        const response = await UserService.deleteUser(userId)

        return res.status(200).json(response)

    } catch (e) {
        console.error(e)

        return res.status(500).json({
            status: "ERR",
            message: e.message
        })
    }
}

const getAllUser = async (req, res) => {
    try {

        const response = await UserService.getAllUser()

        return res.status(200).json(response)

    } catch (e) {
        console.error(e)

        return res.status(500).json({
            status: "ERR",
            message: e.message
        })
    }
}

const getDetailsUser = async (req, res) => {
    try {
        const userId = parseInt(req.params.id)


        if (!userId || isNaN(userId)) {
            return res.status(400).json({
                status: "ERR",
                message: "Invalid userId",
            });
        }


        const response = await UserService.getDetailsUser(userId)

        return res.status(200).json(response)

    } catch (e) {
        console.error(e)

        return res.status(500).json({
            status: "ERR",
            message: e.message
        })
    }
}

const logoutUser = async (req, res) => {
    try {
        return res.status(200).json({
            status: 'OK',
            message: 'Logout successfully'
        })
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    createUser,
    loginUser,
    changePasswordUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
    logoutUser
}