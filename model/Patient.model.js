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
        required: [true, "Gender is required"],
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
        required: [true, "Weight is required"]
    },

    phoneNumber: {
        type: String,
        trim: true,
    },
    country: {
        type: String,
        trim: true,
        // required: [true, "Country is required"]
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
    primaryInsurance: {
        type: Number,
        min: [10, 'Primary Insurance must be at least 10 digit'],
        trim: true,
        required: [true, "Primary Insurance is required"]
    },
    secondaryInsurance: {
        type: Number,
        min: [10, 'Secondary Insurance must be at least 10 digit'],
        trim: true,
        required: [true, "Secondary Insurance is required"]
    },
    address: {
        type: String,
        trim: true,
        required: [true, "Address is required"]
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

