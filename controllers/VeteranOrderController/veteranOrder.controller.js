
const veteranOrderService = require('../../services/VeteranOrderService/veteranOrder.services')

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
