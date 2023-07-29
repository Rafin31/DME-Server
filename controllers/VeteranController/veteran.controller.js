const veteranService = require("../../services/VeteranService/veteran.services")

exports.getAllVeteran = async (req, res) => {
    try {

        const veteran = await veteranService.getAllVeteranService()

        return res.status(200).json({
            status: "success",
            data: veteran
        })
    } catch (error) {
        return res.status(400).json({
            status: "fail",
        })
    }
}

exports.getAllVeteranByDME = async (req, res) => {
    try {
        const { dmeSupplier } = req.query
        const veteran = await veteranService.getAllVeteranByDMEService(dmeSupplier)
        return res.status(200).json({
            status: 'success',
            data: veteran
        })
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            data: error.message
        })
    }
}
