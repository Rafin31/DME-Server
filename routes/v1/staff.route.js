const express = require('express');
const router = express.Router()
const staffController = require('../../controllers/StaffController/staff.controller')


// api/v1/staff
router.route("/")
    .get(staffController.getAllStaff)


module.exports = router


