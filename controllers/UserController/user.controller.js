const User = require("../../model/User.model")
const service = require("../../services/UserServices/user.services")
const { generateToken } = require("../../utils/generateToken")

exports.getAllUser = async (req, res) => {
    try {
        const users = await service.getAllUser()
        res.status(200).json({
            status: "Success",
            data: users
        })
    } catch (error) {
        res.status(400).json({
            status: "failed",
            message: error.message
        })
    }
}
exports.createUser = async (req, res) => {
    try {
        const user = await service.createUserService(req.body)
        res.status(200).json({
            status: "Success",
            data: user
        })
    } catch (error) {
        res.status(400).json({
            status: "failed",
            message: error.message
        })
    }
}

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params
        const user = await service.updateUserService(id, req.body)

        res.status(200).json({
            status: "Success",
            data: user
        })
    } catch (error) {
        res.status(400).json({
            status: "failed",
            message: error.message
        })
    }
}

exports.importPatient = async (req, res) => {
    try {
        res.status(200).json({
            status: "success",
            data: req.file
        })
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error
        })
    }
}

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                status: "failed",
                message: "Give Email and Password!"
            })
        }

        const user = await service.findUserByEmail(email)

        if (!user) {
            return res.status(401).json({
                status: "failed",
                message: "User not found! Please create account"
            })
        }


        const isPasswordValid = user.comparePassword(password, user.password)

        if (!isPasswordValid) {
            return res.status(403).json({
                status: "failed",
                message: "Email or password did not matched!"
            })
        }

        const userStatus = await service.findUserStatus(email);

        if (userStatus !== "Active") {
            return res.status(403).json({
                status: "failed",
                message: "Account is not active. Please contact with admin!"
            })
        }

        const userCategory = await service.findUserCategory(email);

        const token = generateToken({ email: email, categoryId: userCategory._id, status: userStatus })

        const { category, permission } = userCategory.toObject()
        const { password: pwd, status, userCategory: ucg, updatedAt, createdAt, __v, ...others } = user.toObject()

        res.status(200).json({
            status: "Success",
            data: others,
            category: { category, permission },
            token: token,
        })



    } catch (error) {
        res.status(400).json({
            status: "failed",
            message: error.message
        })
    }

}
exports.status = async (req, res) => {
    try {
        const status = await service.createStatus(req.body)
        res.status(200).json({
            status: "Success",
            data: status
        })
    } catch (error) {
        res.status(400).json({
            status: "failed",
            message: error.message
        })
    }
}
exports.category = async (req, res) => {
    try {
        const category = await service.createCategory(req.body)
        res.status(200).json({
            status: "Success",
            data: category
        })
    } catch (error) {
        res.status(400).json({
            status: "failed",
            message: error.message
        })
    }
}
