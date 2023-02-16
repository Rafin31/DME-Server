const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types


const veteranSchema = mongoose.Schema({

    userId: {
        type: ObjectId,
        ref: "User",
        required: ['true', "User Id is missing"]
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
    address: {
        type: String,
        trim: true,
        required: [true, "Address is required"]
    },
    lastFour: {
        type: String,
        trim: true,
        required: [true, "Last Four is required"]
    },
    document: {
        type: [ObjectId],
        ref: "Document"
    },
    assignedVaProsthetic: {
        type: [ObjectId],
        ref: "User",
        required: [true, "Assigned VA is required"]
    }
},
    { timestamps: true }
)

const Veteran = mongoose.model("Veteran", veteranSchema)


module.exports = Veteran;

