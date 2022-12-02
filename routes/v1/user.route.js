const express = require('express');
const router = express.Router()
const userController = require("../../controllers/UserController/user.controller");
const uploadDocument = require('../../middlewares/importDocument')

//api/v1/users

router.route("/")
    .get(userController.getAllUserService)
    .post(userController.createUser)




router.route("/login")
    .post(userController.loginUser)

router.route("/status")
    .post(userController.status)

router.route("/category")
    .post(userController.category)

router.post('/import-patient', uploadDocument("patient").single("patient-list"), userController.importPatient)

router.route("/:id")
    .patch(userController.updateUser)


module.exports = router  