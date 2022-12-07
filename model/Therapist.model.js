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
        required: [true, "Country is required"]
    },
    city: {
        type: String,
        trim: true,
        required: [true, "CIty is required"]
    },
    state: {
        type: String,
        trim: true,
        required: [true, "State is required"]
    },
    zip: {
        type: Number,
        trim: true,
        required: [true, "Zip code is required"]
    },
    address: {
        type: String,
        trim: true,
        required: [true, "Address is required"]
    },
    patient: {
        type: [ObjectId],
        ref: "Patient"
    },

},
    { timestamps: true }
)

const Therapist = mongoose.model("Therapist", therapistSchema)


module.exports = Therapist;

