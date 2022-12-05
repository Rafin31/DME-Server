const service = require('../../services/DmeServices/dme.services')

exports.addTask = async (req, res) => {
    try {
        const task = await service.addTaskService(req.body)
        return res.status(200).json({
            status: 'success',
            data: task
        })
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            data: error
        })
    }
}
exports.getTask = async (req, res) => {
    try {
        const task = await service.getTaskService()
        return res.status(200).json({
            status: 'success',
            data: task
        })
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            data: error
        })
    }
}
exports.updateTask = async (req, res) => {
    try {
        const { id } = req.params
        const task = await service.updateTaskService(id, req.body)

        if (task.modifiedCount === 0) {
            return res.status(400).json({
                status: 'fail',
                data: "Task not found!"
            })
        }

        return res.status(200).json({
            status: 'success',
            data: "Updated"
        })
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            data: error
        })
    }
}
exports.deleteTask = async (req, res) => {
    try {
        const { id } = req.params
        const task = await service.deleteTaskService(id)

        if (task.deletedCount === 0) {
            return res.status(400).json({
                status: 'fail',
                data: "Task not found!"
            })
        }

        return res.status(200).json({
            status: 'success',
            data: task
        })
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            data: error
        })
    }
}