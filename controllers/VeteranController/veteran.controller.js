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
