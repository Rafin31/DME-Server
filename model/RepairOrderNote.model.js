const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types


const RepairOrderNoteSchema = mongoose.Schema({

    writerId: {
        type: ObjectId,
        ref: "User",
        required: ['true', "Writer Id  is missing"]
    },
    orderId: {
        type: ObjectId,
        ref: "User",
        required: ['true', "Order Id  is missing"]
    },
    notes: {
        type: String,
        trim: true,
        required: [true, "Note is required"]
    },
},
    { timestamps: true }
)

const Repair_Order_Note = mongoose.model("Repair_Order_Note", RepairOrderNoteSchema)


module.exports = Repair_Order_Note;

