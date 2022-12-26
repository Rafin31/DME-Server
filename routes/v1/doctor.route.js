const express = require('express');
const router = express.Router()
const doctorController = require('../../controllers/DoctorController/doctor.controller')


// api/v1/doctor

router.route("/")
    .get(doctorController.getAllDoctor)


module.exports = router


