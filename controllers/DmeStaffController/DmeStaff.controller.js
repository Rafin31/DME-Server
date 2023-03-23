const staffService = require('../../services/DmeStaffServices/DmeStaff.services');

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

exports.invitedStaff = async (req, res) => {
    try {
        const { id } = req.params

        const invitedStaff = await staffService.getAllInvitedStaffService(id)

        if (!invitedStaff) {
            return res.status(200).json({
                status: 'success',
                data: []
            })
        }

        return res.status(200).json({
            status: 'success',
            data: invitedStaff
        })
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            data: error.message
        })
    }
}

exports.deleteInvitedStaff = async (req, res) => {
    try {
        const { token } = req.params

        const deleted = await staffService.deleteInvitedStaffService(token)

        return res.status(200).json({
            status: 'success',
            data: deleted
        })
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            data: error.message
        })
    }
}

exports.deleteRegisteredStaff = async (req, res) => {
    try {
        const { id } = req.params

        const deleted = await staffService.deleteRegisteredStaffService(id)

        return res.status(200).json({
            status: 'success',
            data: deleted
        })
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            data: error.message
        })
    }
}