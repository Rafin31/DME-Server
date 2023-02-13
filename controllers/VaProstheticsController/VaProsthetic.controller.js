const VAProstheticService = require('../../services/VaProstheticsService/VaProsthetic.services');

exports.getAllVAStaff = async (req, res) => {
    try {
        const va_staff = await VAProstheticService.getAllVAService()

        if (va_staff.length === 0) {
            return res.status(200).json({
                status: 'success',
                data: []
            })
        }

        return res.status(200).json({
            status: 'success-va_staff',
            data: va_staff
        })
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            data: error.message
        })
    }
}

exports.invitedVAStaff = async (req, res) => {
    try {
        const { id } = req.params

        const invited_va_staff = await VAProstheticService.getAllInvitedVAService(id)

        if (!invited_va_staff) {
            return res.status(200).json({
                status: 'success',
                data: []
            })
        }

        return res.status(200).json({
            status: 'success',
            data: invited_va_staff
        })
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            data: error.message
        })
    }
}

exports.deleteInvitedVAStaff = async (req, res) => {
    try {
        const { token } = req.params

        const deleted = await VAProstheticService.deleteInvitedVAService(token)

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

exports.deleteRegisteredVAStaff = async (req, res) => {
    try {
        const { id } = req.params

        const deleted = await VAProstheticService.deleteRegisteredVAService(id)

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