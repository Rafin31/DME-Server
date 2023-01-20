const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types


const vaProstheticsSchema = mongoose.Schema({

    userId: {
        type: ObjectId,
        ref: "User",
        required: ['true', "User Id is missing"]
    },
    phoneNumber: {
        type: String,
        trim: true,
    },
    admin: {
        type: ObjectId,
        ref: "User",
        required: [true, "admin is required"]
    },
},
    { timestamps: true }
)

const VA_Prosthetics = mongoose.model("VA_Prosthetics", vaProstheticsSchema)


module.exports = VA_Prosthetics;

