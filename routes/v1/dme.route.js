const express = require('express');
const router = express.Router()
const dmeController = require('../../controllers/DmeController/dme.controller')

// api/v1/dme
router.route('/task')
    .post(dmeController.addTask)
    .get(dmeController.getTask)

router.get('/dashboardStates', dmeController.getDashboardStates)

router.route('/task/:id')
    .patch(dmeController.updateTask)
    .delete(dmeController.deleteTask)




module.exports = router