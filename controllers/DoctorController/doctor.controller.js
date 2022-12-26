const doctorService = require('../../services/DoctorService/doctor.services')

exports.getAllDoctor = async (req, res) => {
    try {

        const doctors = await doctorService.getAllDoctorService()

        if (doctors.length === 0) {
            return res.status(200).json({
                status: 'success',
                data: []
            })
        }

        return res.status(200).json({
            status: 'success',
            data: doctors
        })
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            data: error.message
        })
    }
}