const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types


const therapistSchema = mongoose.Schema({

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
        type: String,
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

const Therapist = mongoose.model("Therapist", therapistSchema)


module.exports = Therapist;

