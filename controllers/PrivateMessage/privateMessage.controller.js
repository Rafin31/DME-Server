const privateMessageService = require('../../services/PrivateMessage/privateMessage.services')

exports.insertMessage = async (req, res) => {
    try {
        const message = await privateMessageService.insertPrivateMessageService(req.body)
        return res.status(200).json({
            status: 'success',
            data: "Message sent"
        })

    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            data: error.message
        })
    }
}

exports.getMessageBySender = async (req, res) => {
    try {
        const { id } = req.params
        const message = await privateMessageService.getMessageBySenderService(id)

        if (!message || message.length === 0) {
            console.log("test")
            return res.status(200).json({
                status: 'success',
                data: "No messages found!"
            })
        }

        return res.status(200).json({
            status: 'success',
            data: message
        })

    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            data: error.message
        })
    }
}

exports.getMessageByReceiver = async (req, res) => {
    try {
        const { id } = req.params
        const message = await privateMessageService.getMessageByReceiverService(id)

        if (!message || message.length === 0) {
            return res.status(200).json({
                status: 'success',
                data: "No messages found!"
            })
        }

        return res.status(200).json({
            status: 'success',
            data: message
        })

    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            data: error.message
        })
    }
}

exports.deleteMessage = async (req, res) => {
    try {
        const { id } = req.params
        const message = await privateMessageService.deleteMessageService(id)

        if (message.deletedCount === 0) {
            return res.status(400).json({
                status: 'fail',
                data: "Something Went Wrong!"
            })
        }

        return res.status(200).json({
            status: 'success',
            data: "Message Deleted"
        })

    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            data: error.message
        })
    }
}