const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types


const PrivateMessage = mongoose.Schema({

    senderId: {
        type: ObjectId,
        ref: "User",
        required: ['true', "Sender Id is missing"]
    },
    receiverId: {
        type: ObjectId,
        ref: "User",
        required: ['true', "Receiver Id is missing"]
    },
    subject: {
        type: String,
        trim: true,
        required: ['true', "Subject Id is missing"]
    },
    message: {
        type: String,
        trim: true,
        required: ['true', "Message Id is missing"]
    }
},
    { timestamps: true }
)

const Private_Message = mongoose.model("Private_Message", PrivateMessage)


module.exports = Private_Message;

