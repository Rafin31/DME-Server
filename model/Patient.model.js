const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types


const patientSchema = mongoose.Schema({

    userId: {
        type: ObjectId,
        ref: "User",
        required: ['true', "User Id is missing"]
    },
    gender: {
        type: String,
        trim: true,
        enum: {
            values: ["Male", "male", "Female", "female", "Other", "other"],
            message: "{VALUE} is not a gender"
        }
    },
    dob: {
        type: String,
        trim: true,
        required: [true, "Date of birth is required"]
    },
    weight: {
        type: Number,
        trim: true,
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
    primaryInsurance: {
        type: String,
        trim: true,
    },
    secondaryInsurance: {
        type: String,
        trim: true,
    },
    address: {
        type: String,
        trim: true,
    },
    dmeSupplier: {
        type: ObjectId,
        ref: "User",
        required: [true, "DME Supplier required"]
    },
    doctor: {
        type: [ObjectId],
        ref: "User"
    },
    therapist: {
        type: [ObjectId],
        ref: "User"
    },
    document: {
        type: [ObjectId],
        ref: "Document"
    },
},
    { timestamps: true }
)

const Patient = mongoose.model("Patient", patientSchema)


module.exports = Patient;

