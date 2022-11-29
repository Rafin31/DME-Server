const mongoose = require('mongoose');

const userStatusSchema = mongoose.Schema({

    status: {
        type: String,
        trim: true,
        required: [true, "Status is required"]
    },
},
    { timestamps: true }
)

const UserStatus = mongoose.model("UserStatus", userStatusSchema);

module.exports = UserStatus;
