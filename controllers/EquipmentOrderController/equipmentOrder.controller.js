const orderService = require('../../services/EquipmentOrderService/equipmentOrder.services')

exports.createOrder = async (req, res) => {
    try {

        const order = await orderService.createOrderService(req.body)

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
exports.getAllOrder = async (req, res) => {
    try {

        const orders = await orderService.getAllOrderService()

        return res.status(200).json({
            status: 'success',
            data: orders
        })
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            data: error.message
        })
    }
}
exports.getOrderByDmeSupplier = async (req, res) => {
    try {
        const { id: dmeSupplierId } = req.params
        const order = await orderService.getOrderByDmeSupplierService(dmeSupplierId)

        if (order.length === 0) {
            return res.status(200).json({
                status: 'success',
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

exports.getOrderByPatient = async (req, res) => {
    try {
        const { id: patientId } = req.params
        const order = await orderService.getOrderByPatientService(patientId)

        if (order.length === 0) {
            return res.status(200).json({
                status: 'success',
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

exports.getOrderByStatus = async (req, res) => {
    try {
        const { status } = req.body
        const order = await orderService.getOrderByStatusService(status)

        if (order.length === 0) {
            return res.status(401).json({
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

exports.getArchiveOrder = async (req, res) => {
    try {
        const { id } = req.params
        const order = await orderService.getArchiveOrderService(id)

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

exports.getOrderById = async (req, res) => {
    try {
        const { id } = req.params
        const order = await orderService.getOrderByIdService(id)


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



exports.updateOrder = async (req, res) => {
    try {
        const { id } = req.params
        const updated = await orderService.updateOrderService(req.body, id)

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
        const deleteOrder = await orderService.deleteOrderService(id)

        return res.status(200).json({
            status: 'success',
            data: deleteOrder
        })

    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            data: "Something Went Wrong"
        })
    }

}

exports.insertOrderNote = async (req, res) => {
    try {
        const { id } = req.params
        const updated = await orderService.insertOrderNoteService(req.body, id)

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

//notes

exports.getNotesByOrderId = async (req, res) => {
    try {
        const { id } = req.params
        const notes = await orderService.getNotesByOrderIdService(id)


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

exports.publishNotesByOrderId = async (req, res) => {
    try {
        const { id } = req.params
        const notes = await orderService.publishNotesByOrderIdService(id, req.body)

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