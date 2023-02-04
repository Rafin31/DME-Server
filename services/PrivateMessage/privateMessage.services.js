const Private_Message = require("../../model/PrivateMessage.model")

exports.insertPrivateMessageService = async (data) => {
    const message = await Private_Message.create(data)
    return message
}

exports.getMessageBySenderService = async (id) => {
    const message = Private_Message.find({ senderId: { $eq: id } })
        .populate({ path: 'senderId', select: "fullName email" })
        .populate({ path: 'receiverId', select: "fullName email" })
        .select('-__v')

    return message
}

exports.getMessageByReceiverService = async (id) => {
    const message = Private_Message.find({ receiverId: { $eq: id } })
        .populate({ path: 'senderId', select: "fullName email" })
        .populate({ path: 'receiverId', select: "fullName email" })
        .select('-__v')

    return message
}

exports.deleteMessageService = async (id) => {
    const message = Private_Message.deleteOne({ _id: id })
    return message
}