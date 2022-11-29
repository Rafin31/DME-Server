const express = require('express');
const router = express.Router()


const userController = require("../../controllers/user.controller");

router.route("/")
    .get(userController.getAllUser)
    .post(userController.createUser)

router.route("/status")
    .post(userController.status)

router.route("/category")
    .post(userController.category)

module.exports = router  