const express = require('express');
const router = express.Router()
const userController = require("../../controllers/UserController/user.controller");
const uploadDocument = require('../../middlewares/importDocument')

// api/v1/users

router.route("/")
    .get(userController.getAllUser)
    .post(userController.createUser)

router.route("/active-user")
    .get(userController.getAllActiveUser)


router.route("/login")
    .post(userController.loginUser)

router.route("/status")
    .post(userController.status)

router.route("/category")
    .post(userController.category)



router.post('/import-patient', uploadDocument("patient-import").single("patient-list"), userController.importPatient)
router.post('/import-doctor', uploadDocument("doctor-import").single("doctor-list"), userController.importDoctor)



router.get('/export-patient', userController.exportPatient)
router.get('/export-doctor', userController.exportDoctor)

router.post('/reset-password-request', userController.resetPasswordRequest)
router.get('/reset-password-request/confirmation/:token', userController.resetPasswordConfirmation) //will come from user email
router.post('/reset-password-operation', userController.resetPasswordOperation)

router.route("/:id")
    .get(userController.getUserByID)
    .patch(userController.updateUser)
    .delete(userController.deleteUser)


module.exports = router


