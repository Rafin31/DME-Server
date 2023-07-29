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
    zip: {
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
    address: {
        type: String,
        trim: true,
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
    },
    dmeSupplier: {
        type: ObjectId,
        ref: "User",
        required: [true, "DME Supplier required"]
    },
},
    { timestamps: true }
)

const Veteran = mongoose.model("Veteran", veteranSchema)


module.exports = Veteran;

