const express = require('express');
const router = express.Router()
const repairOrderController = require('../../controllers/RepairOrderController/repairOrder.controller')


router.route('/')
    .post(repairOrderController.createRepairOrder)


module.exports = router