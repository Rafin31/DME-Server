const express = require('express');
const { get } = require('mongoose');
const router = express.Router()
const userController = require("../../controllers/UserController/user.controller");
const uploadDocument = require('../../middlewares/importDocument')

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

router.post('/import-patient', uploadDocument("patient").single("patient-list"), userController.importPatient)
router.get('/export-patient', userController.exportPatient)
router.post('/reset-password', userController.resetPassword)
router.get('/reset-password/confirmation/:token', (req, res) => { res.json("success") })
router.route("/:id")
    .get(userController.getUserByID)
    .patch(userController.updateUser)
    .delete(userController.deleteUser)


module.exports = router  
