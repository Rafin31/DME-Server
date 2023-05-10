const express = require('express');
const router = express.Router()
const veteranOrderController = require('../../controllers/VeteranOrderController/veteranOrder.controller')

//veteran-order

router.route('/')
    .post(veteranOrderController.createVeteranOrder)
    .get(veteranOrderController.getAllVeteranOrder)


router.route('/byStatus')
    .get(veteranOrderController.getVeteranOrderByStatus)

router.route('/archive-orders/:id')
    .get(veteranOrderController.getArchiveVeteranOrder)

router.route('/veteran-order-note/:id')
    .get(veteranOrderController.getNotesByVeteranOrderId)
    .post(veteranOrderController.insertNotesByVeteranOrderId)
    .delete(veteranOrderController.deleteVeteranOrderNoteById)

router.route('/creator/:id')
    .get(veteranOrderController.getVeteranOrderByCreatorId)

router.route('/veteran/:id')
    .get(veteranOrderController.getVeteranOrderByPatient)

router.route('/:id')
    .get(veteranOrderController.getVeteranOrderById)
    .patch(veteranOrderController.updateVeteranOrder)
    .delete(veteranOrderController.deleteOrder)


module.exports = router