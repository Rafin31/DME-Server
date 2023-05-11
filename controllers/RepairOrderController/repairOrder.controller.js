const repairOrderService = require('../../services/RepairOrderService/repairOrder.services')


exports.createRepairOrder = async (req, res) => {
    try {

        const repairOrder = await repairOrderService.createRepairOrderService(req.body)

        return res.status(200).json({
            status: 'success',
            data: repairOrder
        })
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            data: error?.message
        })
    }
}

exports.getAllRepairOrder = async (req, res) => {
    try {

        const repairOrder = await repairOrderService.getAllRepairOrderService()

        return res.status(200).json({
            status: 'success',
            data: repairOrder
        })
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            data: error?.message
        })
    }
}

exports.getRepairOrderById = async (req, res) => {
    try {
        const { id } = req.params
        const repairOrder = await repairOrderService.getRepairOrderbyIdService(id)

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

exports.getRepairOrderByDMESupplier = async (req, res) => {
    try {
        const { id } = req.params
        const repairOrder = await repairOrderService.getRepairOrderByDmeSupplierService(id)

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

exports.getRepairOrderByPatient = async (req, res) => {
    try {
        const { id } = req.params
        const repairOrder = await repairOrderService.getRepairOrderByDmePatientService(id)

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


exports.updateRepairOrder = async (req, res) => {
    try {
        const { id } = req.params
        const updated = await repairOrderService.updateRepairOrderService(req.body, id)

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

exports.deleteOrder = async (req, res) => {

    try {
        const { id } = req.params
        const deleteOrder = await repairOrderService.deleteOrderService(id)

        if (!deleteOrder) {
            return res.status(200).json({
                status: 'success',
                data: "No order Found with this ID"
            })
        }



        return res.status(200).json({
            status: 'success',
            data: deleteOrder
        })

    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            data: error
        })
    }

}


exports.insertNotesByRepairOrderId = async (req, res) => {
    try {
        const { id } = req.params
        const notes = await repairOrderService.insertRepairOrderNoteService(req.body, id)

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

exports.getNotesByRepairOrderId = async (req, res) => {
    try {
        const { id } = req.params
        const notes = await repairOrderService.getRepairOrderNoteByIdService(id)



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

exports.getRepairOrderByStatus = async (req, res) => {
    try {
        const { status } = req.body
        const order = await repairOrderService.getRepairOrderByStatusService(status)

        if (order.length === 0) {
            return res.status(200).json({
                status: 'fail',
                data: "No order found!"
            })
        }

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

exports.getArchiveRepairOrder = async (req, res) => {
    try {
        const { id } = req.params
        const order = await repairOrderService.getArchiveRepairOrderService(id)

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

exports.publishNotesByOrderId = async (req, res) => {
    try {
        const { id } = req.params
        const notes = await repairOrderService.publishNotesByOrderIdService(id, req.body)

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
