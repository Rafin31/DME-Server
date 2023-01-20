const express = require('express');
const router = express.Router()
const veteranOrderController = require('../../controllers/VeteranOrderController/veteranOrder.controller')

router.route('/')
    .post(veteranOrderController.createVeteranOrder)

module.exports = router