const mongoose = require('mongoose');

const userCategorySchema = mongoose.Schema({

    category: {
        type: String,
        trim: true,
        required: [true, "Status is required"]
    },
    permission: {
        type: [String],
        required: [true, "Permission is required"]
    }
},
    { timestamps: true }
)

const UserCategory = mongoose.model("UserCategory", userCategorySchema);

module.exports = UserCategory;
