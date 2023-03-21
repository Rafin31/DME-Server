const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types


const notesSchema = mongoose.Schema({

    writerId: {
        type: ObjectId,
        ref: "User",
        required: ['true', "Writer Id  is missing"]
    },
    noteFor: {
        type: ObjectId,
        ref: "User",
        required: ['true', "Note for is missing"]
    },
    note: {
        type: String,
        trim: true,
        required: [true, "Note is required"]
    },
},
    { timestamps: true }
)

const Notes = mongoose.model("Notes", notesSchema)


module.exports = Notes;

