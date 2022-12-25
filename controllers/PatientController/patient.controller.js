const patientService = require('../../services/PatientServices/patient.services')

exports.getAllPatient = async (req, res) => {
    try {

        const patient = await patientService.getAllPatientService()
        return res.status(200).json({
            status: 'success',
            data: patient
        })
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            data: error.message
        })
    }
}