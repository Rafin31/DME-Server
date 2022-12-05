const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types


const taskSchema = mongoose.Schema({

    dmeSupplierId: {
        type: ObjectId,
        ref: "DME_Supplier",
        required: ['true', "Dme Supplier Id  is missing"]
    },
    patientId: {
        type: ObjectId,
        ref: "Patient",
        required: ['true', "Patient Id  is missing"]
    },
    title: {
        type: String,
        trim: true,
        required: [true, "Title is required"]
    },
    description: {
        type: String,
        trim: true,
        required: [true, "Description is required"]
    },
    taskDate: {
        type: String,
        trim: true,
        required: [true, "Task Date is required"]
    }
},
    { timestamps: true }
)

const Task = mongoose.model("Task", taskSchema)


module.exports = Task;

