const express = require('express');
const orderController = require('../../controllers/OrderController/order.controller')
const router = express.Router()

// api/v1/order


router.route("/")
    .post(orderController.createOrder)
    .get(orderController.getAllOrder)

router.route("/dme-supplier/:id")
    .get(orderController.getOrderByDmeSupplier)

router.route("/patient/:id")
    .get(orderController.getOrderByPatient)

router.route("/status")
    .get(orderController.getOrderByStatus)

router.route("/orderNote/:id")
    .get(orderController.getNotesByOrderId)
    .post(orderController.insertOrderNote)

router.route("/:id")
    .get(orderController.getOrderById)
    .patch(orderController.updateOrder)

module.exports = router