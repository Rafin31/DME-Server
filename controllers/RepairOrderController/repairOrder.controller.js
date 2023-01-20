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