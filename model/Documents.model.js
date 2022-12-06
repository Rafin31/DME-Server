const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types


const documentSchema = mongoose.Schema({

    uploaderId: {
        type: ObjectId,
        ref: "User",
        required: ['true', "Writer Id  is missing"]
    },
    document: {
        type: ObjectId,
        ref: "User",
        required: ['true', "Patient Id  is missing"]
    },
    note: {
        type: String,
        trim: true,
    },
},
    { timestamps: true }
)

const Document = mongoose.model("Document", documentSchema)


module.exports = Document;

