const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types


const VeteranOrderNoteSchema = mongoose.Schema({

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
    note: {
        type: String,
        trim: true,
        required: [true, "Note is required"]
    },
},
    { timestamps: true }
)

const Veteran_Order_Note = mongoose.model("Veteran_Order_Note", VeteranOrderNoteSchema)


module.exports = Veteran_Order_Note;

