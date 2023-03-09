const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types


const doctorSchema = mongoose.Schema({

    userId: {
        type: ObjectId,
        ref: "User",
        required: ['true', "User Id is missing"]
    },
    companyName: {
        type: String,
        trim: true,
        required: [true, "Company Name is required"]
    },
    npiNumber: {
        type: Number,
        trim: true,
        required: [true, "NPI number is required"]
    },
    phoneNumber: {
        type: String,
        trim: true,
    },
    country: {
        type: String,
        trim: true,
    },
    city: {
        type: String,
        trim: true,
    },
    state: {
        type: String,
        trim: true,
    },
    zip: {
        type: Number,
        trim: true,
    },
    address: {
        type: String,
        trim: true,
    },
    patient: {
        type: [ObjectId],
        ref: "User"
    },

},
    { timestamps: true }
)

const Doctor = mongoose.model("Doctor", doctorSchema)


module.exports = Doctor;

