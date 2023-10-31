const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types


const AssignedTaskSchema = mongoose.Schema({

    assignedBy: {
        type: ObjectId,
        ref: "User",
        required: ['true', "User Id is missing"]
    },
    assignedTo: {
        type: ObjectId,
        ref: "User",
        required: ['true', "User Id is missing"]
    },

    title: {
        type: String,
        trim: true,
        required: ['true', "Task Title is missing"],
    },
    description: {
        type: String,
        trim: true,
        required: ['true', "Task Description is missing"],
    },
    deadline: {
        type: String,
        trim: true,
        required: ['true', "Deadline is missing"],
    },
    status: {
        type: String,
        required: ['true', "Status is missing"],
        enum: {
            values: ["Pending", "Accepted", "Rejected", "Completed", "Finish"],
            message: "{VALUE} is not a Assigned Task Status"
        },
    },

},
    { timestamps: true }
)

const AssignedTask = mongoose.model("Assigned_Task", AssignedTaskSchema)


module.exports = AssignedTask;

