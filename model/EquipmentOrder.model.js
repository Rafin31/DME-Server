const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types


const EquipmentOrderSchema = mongoose.Schema({

    dmeSupplierId: {
        type: ObjectId,
        ref: "User",
        required: ['true', "DME Supplier Id is missing"]
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
        ref: "Order_Note"
    },
    document: {
        type: [ObjectId],
        ref: "Document"
    },
    status: {
        type: String,
        required: ['true', "Order Status is missing"],
        enum: {
            values: ["Pending", "Cancelled", "New-Referral", "Evaluation", "Evaluation-Completed", "Paper-Work-In-Process", "Prior-Auth-Status",
                "Prior-Auth-Receive", "Holding-RTO", "RTO", "Delivered", "Authorization-Expiration-F/U", "Order-Request"],
            message: "{VALUE} is not a Order Status"
        }
    },
},
    { timestamps: true }
)

const EquipmentOrder = mongoose.model("Equipment_Order", EquipmentOrderSchema)


module.exports = EquipmentOrder;

