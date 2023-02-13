const express = require('express');
const router = express.Router()
const vaStaffController = require('../../controllers/VaProstheticsController/VaProsthetic.controller')


// api/v1/va-staff
router.route("/")
    .get(vaStaffController.getAllVAStaff)

router.route("/invited-va-staff/:id")
    .get(vaStaffController.invitedVAStaff)

router.route("/delete-invited-va-staff/:token")
    .delete(vaStaffController.deleteInvitedVAStaff)

router.route("/delete-registered-va-staff/:id")
    .delete(vaStaffController.deleteRegisteredVAStaff)



module.exports = router


