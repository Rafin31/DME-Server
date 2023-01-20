const express = require('express');
const router = express.Router()
const veteranController = require('../../controllers/VeteranController/veteran.controller')



router.route('/')
    .get(veteranController.getAllVeteran)
module.exports = router