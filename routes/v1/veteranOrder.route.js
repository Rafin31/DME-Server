const express = require('express');
const router = express.Router()
const veteranOrderController = require('../../controllers/VeteranOrderController/veteranOrder.controller')

//veteran-order

router.route('/')
    .post(veteranOrderController.createVeteranOrder)
    .get(veteranOrderController.getAllVeteranOrder)


router.route('/byStatus')
    .get(veteranOrderController.getVeteranOrderByStatus)


router.route('/veteran-order-note/:id')
    .get(veteranOrderController.getNotesByVeteranOrderId)

router.route('/creator/:id')
    .get(veteranOrderController.getVeteranOrderByCreatorId)

router.route('/veteran/:id')
    .get(veteranOrderController.getVeteranOrderByPatient)

router.route('/:id')
    .get(veteranOrderController.getVeteranOrderById)
    .patch(veteranOrderController.updateVeteranOrder)


module.exports = router