const express = require('express');
const router = express.Router()
const userController = require("../../controllers/UserController/user.controller");

//api/v1/users

router.route("/")
    .get(userController.getAllUser)
    .post(userController.createUser)

router.route("/login")
    .post(userController.loginUser)

router.route("/status")
    .post(userController.status)

router.route("/category")
    .post(userController.category)

router.route("/:id")
    .patch(userController.updateUser)


module.exports = router  