const express = require('express');
const router = express.Router()
const therapistController = require('../../controllers/TherapistController/therapist.controller')


// api/v1/therapist

router.route("/")
    .get(therapistController.getAllTherapist)


module.exports = router


