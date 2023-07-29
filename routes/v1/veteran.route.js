const express = require('express');
const router = express.Router()
const veteranController = require('../../controllers/VeteranController/veteran.controller')



router.route('/')
    .get(veteranController.getAllVeteran)

router.route("/byDmeSupplier")
    .get(veteranController.getAllVeteranByDME)


module.exports = router