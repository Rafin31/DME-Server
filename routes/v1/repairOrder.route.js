const express = require('express');
const router = express.Router()
const repairOrderController = require('../../controllers/RepairOrderController/repairOrder.controller')


//repair-order

router.route('/')
    .post(repairOrderController.createRepairOrder)
    .get(repairOrderController.getAllRepairOrder)

router.route('/byStatus')
    .get(repairOrderController.getRepairOrderByStatus)


router.route('/dme-supplier/:id')
    .get(repairOrderController.getRepairOrderByDMESupplier)

router.route('/archive-orders/:id')
    .get(repairOrderController.getArchiveRepairOrder)

router.route('/patient/:id')
    .get(repairOrderController.getRepairOrderByPatient)

router.route('/repair-order-note/:id')
    .get(repairOrderController.getNotesByRepairOrderId)
    .post(repairOrderController.insertNotesByRepairOrderId)


router.route('/:id')
    .get(repairOrderController.getRepairOrderById)
    .patch(repairOrderController.updateRepairOrder)


module.exports = router