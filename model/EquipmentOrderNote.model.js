const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types


const EquipmentOrderNoteSchema = mongoose.Schema({

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

const Equipment_Order_Note = mongoose.model("Equipment_Order_Note", EquipmentOrderNoteSchema)


module.exports = Equipment_Order_Note;

