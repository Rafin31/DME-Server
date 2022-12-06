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

// notes

exports.addNotes = async (req, res) => {
    try {
        const notes = await service.addNotesService(req.body)
        return res.status(200).json({
            status: 'success',
            data: notes
        })
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            data: error
        })
    }
}
exports.getNotes = async (req, res) => {
    try {
        const notes = await service.getNotesService()
        return res.status(200).json({
            status: 'success',
            data: notes
        })
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            data: error
        })
    }
}
exports.updateNotes = async (req, res) => {
    try {
        const { id } = req.params
        const notes = await service.updateNotesService(id, req.body)

        if (notes.modifiedCount === 0) {
            return res.status(400).json({
                status: 'fail',
                data: "Notes not found!"
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
exports.deleteNotes = async (req, res) => {
    try {
        const { id } = req.params
        const notes = await service.deleteNotesService(id)

        if (notes.deletedCount === 0) {
            return res.status(400).json({
                status: 'fail',
                data: "Task not found!"
            })
        }

        return res.status(200).json({
            status: 'success',
            data: notes
        })
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            data: error
        })
    }
}

//upload document 

exports.uploadDocuments = async (req, res) => {
    try {
        const documentFileName = req.file.filename
        const path = req.file.destination
        const { uploaderId } = req.body
        const { id: patientId } = req.params
        const fileName = path.split('uploads/')[1] + "/" + documentFileName

        const uploaded = await service.uploadDocumentsService(fileName, path, patientId, uploaderId)

        return res.status(200).json({
            status: "Success",
            data: uploaded
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            status: "Fail",
            data: error
        })
    }

}

exports.getDashboardStates = async (req, res) => {
    try {

        const states = await service.getDashboardStatesService()
        res.status(200).json({
            status: "success",
            message: states
        })

    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error
        })
    }
}