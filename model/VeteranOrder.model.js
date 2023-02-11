const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types


const VeteranOrderSchema = mongoose.Schema({

    dmeSupplierId: {
        type: ObjectId,
        ref: "User",
        required: ['true', "Creator Id is missing"]
    },
    veteranId: {
        type: ObjectId,
        ref: "User",
        required: ['true', "Patient Id is missing"]
    },
    description: {
        type: String,
        trim: true
    },
    partsPo: {
        type: String,
        trim: true
    },
    labourPo: {
        type: String,
        trim: true
    },
    notes: {
        type: ObjectId,
        ref: "Veteran_Order_Note"
    },
    document: {
        type: [ObjectId],
        ref: "Document"
    },
    firstAttempt: {
        type: String,
        trim: true
    },
    secondAttempt: {
        type: String,
        trim: true
    },
    schedule: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        required: ['true', "Order Status is missing"],
        enum: {
            values: ["Equip", "New Repair", "Rcvd-pending-scheduling", "Estimate-sent-pending-po", "Po-Received", "Parts-ordered-by-VAMC", "Parts-ordered-by-GCM", "Pending-scheduling", "Completed", "Pending", "Cancelled", "Archived"],
            message: "{VALUE} is not a Order Status"
        }
    },
},
    { timestamps: true }
)

const VeteranOrder = mongoose.model("Veteran_Order", VeteranOrderSchema)


module.exports = VeteranOrder;

