const veteranOrderService = require('../../services/VeteranOrderService/veteranOrder.services')
const userService = require('../../services/UserServices/user.services')

exports.createVeteranOrder = async (req, res) => {
    try {

        const veteranOrder = await veteranOrderService.createVeteranOrderService(req.body)

        return res.status(200).json({
            status: 'success',
            data: veteranOrder
        })
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            data: error?.message
        })
    }
}

exports.getAllVeteranOrder = async (req, res) => {
    try {

        const veteranOrder = await veteranOrderService.getAllVeteranOrderService()

        return res.status(200).json({
            status: 'success',
            data: veteranOrder
        })
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            data: error?.message
        })
    }
}

exports.getVeteranOrderById = async (req, res) => {
    try {
        const { id } = req.params
        const veteranOrder = await veteranOrderService.getVeteranOrderbyIdService(id)

        if (!veteranOrder || veteranOrder.length === 0) {
            return res.status(200).json({
                status: 'success',
                data: "No order found!"
            })
        }

        return res.status(200).json({
            status: 'success',
            data: veteranOrder
        })
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            data: error.message
        })
    }
}

exports.getVeteranOrderByCreatorId = async (req, res) => {
    try {
        const { id } = req.params
        const veteranOrder = await veteranOrderService.getVeteranOrderByCreatorIdService(id)

        for (const v of veteranOrder) {
            const user = await userService.findUserByIdService(v.veteranId._id);
            v.veteranId.lastFour = user.details.lastFour;
        }

        if (!veteranOrder || veteranOrder.length === 0) {
            return res.status(200).json({
                status: 'success',
                data: "No order found!"
            })
        }

        return res.status(200).json({
            status: 'success',
            data: veteranOrder
        })
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            data: error.message
        })
    }
}

exports.getVeteranOrderByPatient = async (req, res) => {
    try {
        const { id } = req.params
        const repairOrder = await veteranOrderService.getVeteranOrderByVeteranService(id)

        if (!repairOrder || repairOrder.length === 0) {
            return res.status(200).json({
                status: 'success',
                data: "No order found!"
            })
        }

        return res.status(200).json({
            status: 'success',
            data: repairOrder
        })
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            data: error.message
        })
    }
}

exports.updateVeteranOrder = async (req, res) => {
    try {
        const { id } = req.params
        const updated = await veteranOrderService.updateVeteranOrderService(req.body, id)

        if (!updated) {
            return res.status(400).json({
                status: 'fail',
                data: "Something Went Wrong"
            })
        }

        return res.status(200).json({
            status: 'success',
            data: updated
        })
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            data: error.message
        })
    }
}

exports.getNotesByVeteranOrderId = async (req, res) => {
    try {
        const { id } = req.params
        const notes = await veteranOrderService.getVeteranOrderNoteByIdService(id)

        return res.status(200).json({
            status: 'success',
            data: notes
        })
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            data: error.message
        })
    }
}

exports.getVeteranOrderByStatus = async (req, res) => {
    try {
        const { status } = req.body
        const order = await veteranOrderService.getVeteranOrderByStatusService(status)

        return res.status(200).json({
            status: 'success',
            data: order
        })
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            data: error.message
        })
    }
}

exports.getArchiveVeteranOrder = async (req, res) => {
    try {
        const { id } = req.params
        const order = await veteranOrderService.getArchiveVeteranOrderService(id)

        return res.status(200).json({
            status: 'success',
            data: order
        })
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            data: error.message
        })
    }
}




