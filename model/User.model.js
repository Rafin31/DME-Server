const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { ObjectId } = mongoose.Schema.Types;

const userSchema = mongoose.Schema({

    firstName: {
        type: String,
        trim: true,
        required: [true, "First Name is required"]
    },
    lastName: {
        type: String,
        trim: true,
        required: [true, "Last Name is required"]
    },
    fullName: {
        type: String,
        trim: true,
        required: [true, "Full Name is required"]
    },
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
    userImage: {
        type: String,
        trim: true,
    },
    password: {
        type: String,
        trim: true,
        required: [true, "Password is required"],
        validate: {
            validator: (value) =>
                validator.isStrongPassword(value, {
                    minLength: 8,
                    minLowercase: 1,
                    minNumber: 1,
                    minUppercase: 1,
                    minSymbol: 1,
                }),
            message: "Password should be 8 characters long and should contain minimum of one lowercase, number, uppercase and symbol!"
        },
    },
    confirmPassword: {
        type: String,
        trim: true,
        validate: {
            validator: function (value) {
                return value === this.password;
            },
            message: "Confirm Password did not matched!"
        }
    },
    userCategory: {
        type: ObjectId,
        ref: "UserCategory",
        required: [true, "User Category is required"]
    },
    status: {
        type: ObjectId,
        ref: "UserStatus",
        required: [true, "User Status is required"]
    },
    token: String,
    expireToken: Date,
},
    { timestamps: true }
)

//Hashing Password and remove confirm password
userSchema.pre('save', function (next) {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(this.password, salt);
    this.password = hashedPassword;
    this.confirmPassword = undefined;
    next();
})


userSchema.pre('insertMany', function (next, docs) {
    try {
        const salt = bcrypt.genSaltSync(10);
        docs.map(data => {
            const hashedPassword = bcrypt.hashSync(data.password, salt);
            data.password = hashedPassword;
            data.confirmPassword = undefined;

        })
        return next();

    } catch (error) {
        return next(error);
    }


})



userSchema.methods.comparePassword = function (password, hash) {
    const isPasswordValid = bcrypt.compareSync(password, hash);
    return isPasswordValid;
}

const User = mongoose.model("User", userSchema);

module.exports = User;
