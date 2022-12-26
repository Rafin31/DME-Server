const staffService = require('../../services/StaffServices/staff.services');

exports.getAllStaff = async (req, res) => {
    try {

        const staff = await staffService.getAllStaffService()

        if (staff.length === 0) {
            return res.status(200).json({
                status: 'success',
                data: []
            })
        }

        return res.status(200).json({
            status: 'success-staff',
            data: staff
        })
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            data: error.message
        })
    }
}