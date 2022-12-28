const mongoose = require('mongoose');
const validator = require('validator');
const { ObjectId } = mongoose.Schema.Types


const invitedStaffSchema = mongoose.Schema({

    email: {
        type: String,
        trim: true,
        required: [true, "Email is required"],
        validate: [validator.isEmail, "Provide a valid Email address"],
        lowercase: true,
        validate: {
            validator: function (value) {
                return this.model('User').findOne({ email: value }).then(user => !user)
            },
            message: props => `${props.value} is already used by another user`
        },
    },

    admin: {
        type: ObjectId,
        ref: "User",
        required: [true, "admin is required"]
    },
    inviteToken: {
        type: String,
        trim: true,
        required: [true, "Token is required"]
    },
},
    { timestamps: true }
)

const Invited_Staff = mongoose.model("Invited_Staff", invitedStaffSchema)


module.exports = Invited_Staff;

