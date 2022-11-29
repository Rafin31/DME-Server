const service = require("../services/user.services")

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