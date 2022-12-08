const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types


const orderNotesSchema = mongoose.Schema({

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

const Order_Note = mongoose.model("Order_Note", orderNotesSchema)


module.exports = Order_Note;

