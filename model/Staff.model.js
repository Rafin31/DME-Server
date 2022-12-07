const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types


const staffSchema = mongoose.Schema({

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
    admin: {
        type: [ObjectId],
        ref: "DME_Supplier",
        required: [true, "admin is required"]
    },
},
    { timestamps: true }
)

const Staff = mongoose.model("Staff", staffSchema)


module.exports = Staff;

