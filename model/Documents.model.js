const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types


const documentSchema = mongoose.Schema({

    uploaderId: {
        type: ObjectId,
        ref: "User",
        required: ['true', "Uploader Id  is missing"]
    },
    title: {
        type: String,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    document: {
        type: String,
        trim: true,
        required: ['true', "Document is missing"]
    }

},
    { timestamps: true }
)

const Document = mongoose.model("Document", documentSchema)


module.exports = Document;

