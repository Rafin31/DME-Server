const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types


const RepairOrderSchema = mongoose.Schema({

    creatorId: {
        type: ObjectId,
        ref: "User",
        required: ['true', "Creator Id Id is missing"]
    },
    patientId: {
        type: ObjectId,
        ref: "User",
        required: ['true', "Patient Id is missing"]
    },
    description: {
        type: String,
        trim: true
    },
    notes: {
        type: ObjectId,
        ref: "Repair_Order_Note"
    },
    document: {
        type: [ObjectId],
        ref: "Document"
    },
    status: {
        type: String,
        required: ['true', "Order Status is missing"],
        enum: {
            values: ["Pending", "Cancelled", "PRR", "Pending-Rx", "Pending-Assess", "Workup", "Pa-Status",
                "RTO-Status", "Pending-Parts", "Pending-Scheduling", "Completed", "Archived"],
            message: "{VALUE} is not a Order Status"
        }
    },
},
    { timestamps: true }
)

const RepairOrder = mongoose.model("Repair_Order", RepairOrderSchema)


module.exports = RepairOrder;

