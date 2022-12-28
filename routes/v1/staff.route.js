const express = require('express');
const router = express.Router()
const staffController = require('../../controllers/StaffController/staff.controller')


// api/v1/staff
router.route("/")
    .get(staffController.getAllStaff)

router.route("/invited-staff/:id")
    .get(staffController.invitedStaff)

router.route("/delete-invited-staff/:token")
    .delete(staffController.deleteInvitedStaff)

router.route("/delete-registered-staff/:id")
    .delete(staffController.deleteRegisteredStaff)



module.exports = router


