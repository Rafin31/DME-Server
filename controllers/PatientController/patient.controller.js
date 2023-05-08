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


exports.getAllPatientByDME = async (req, res) => {
    try {
        const { dmeSupplier } = req.query
        const patient = await patientService.getAllPatientByDMEService(dmeSupplier)
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


exports.deletePatientByID = async (req, res) => {
    try {
        const { id } = req.params
        const deletedPatient = await patientService.deletePatientByIDService(id)

        return res.status(200).json({
            status: 'success',
            data: deletedPatient
        })
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            data: error.message
        })
    }
}