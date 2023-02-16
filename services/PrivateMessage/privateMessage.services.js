const Private_Message = require("../../model/PrivateMessage.model")


exports.insertPrivateMessageService = async (data) => {
    const message = await Private_Message.create(data)
    return message
}

exports.getMessageBySenderService = async (senderId) => {
    const message = Private_Message.find({ $or: [{ senderId: { $eq: senderId } }, { receiverId: { $eq: senderId } }] })
        .sort('createdAt')
        .populate({ path: 'senderId', select: "fullName email" })
        .populate({ path: 'receiverId', select: "fullName email" })
        .select('-__v')

    return message
}

exports.getMessageByReceiverService = async (receiverId, senderId) => {
    const message = Private_Message.find({ $and: [{ receiverId: { $eq: receiverId } }, { senderId: { $eq: senderId } }] })
        .populate({ path: 'senderId', select: "fullName email" })
        .populate({ path: 'receiverId', select: "fullName email" })
        .select('-__v')

    return message
}

exports.deleteMessageService = async (id) => {
    const message = Private_Message.deleteOne({ _id: id })
    return message
}

exports.getNewMessagesService = async (id) => {
    const message = Private_Message.find({ $and: [{ receiverId: { $eq: id } }, { hasRead: "false" }] })
    return message
}

exports.getChatService = async (senderId, receiverId) => {
    const message = Private_Message.find(
        {
            $or: [
                {
                    $and: [{ senderId: { $eq: senderId } }, { receiverId: { $eq: receiverId } }]
                },
                {
                    $and: [{ senderId: { $eq: receiverId } }, { receiverId: { $eq: senderId } }]
                }
            ]
        })
        .sort('createdAt')
        .populate({ path: 'senderId', select: "fullName email" })
        .populate({ path: 'receiverId', select: "fullName email" })
        .select('-__v')

    return message
}



