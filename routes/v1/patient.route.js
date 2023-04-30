const express = require('express');
const router = express.Router()
const patientController = require('../../controllers/PatientController/patient.controller')


// api/v1/patient

router.route("/")
    .get(patientController.getAllPatient)


router.route("/byDmeSupplier")
    .get(patientController.getAllPatientByDME)



module.exports = router


