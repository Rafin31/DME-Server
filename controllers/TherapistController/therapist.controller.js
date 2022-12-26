const therapistService = require('../../services/TherapistServices/therapist.services');


exports.getAllTherapist = async (req, res) => {
    try {

        const therapist = await therapistService.getAllTherapistService()

        if (therapist.length === 0) {
            return res.status(200).json({
                status: 'success',
                data: []
            })
        }

        return res.status(200).json({
            status: 'success',
            data: therapist
        })
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            data: error.message
        })
    }
}