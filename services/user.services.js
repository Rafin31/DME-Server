const User = require('../model/User.model');
const UserStatus = require('../model/UserStatus.model');
const UserCategory = require('../model/UserCategory.model');

exports.getAllUser = async () => {
    const user = await User.find({})
        .lean()
        .populate({ path: 'status', select: '-_id -updatedAt -createdAt -__v' })
        .populate({ path: 'userCategory', select: '-_id -updatedAt -createdAt -__v' })

    return user;
}
exports.createUserService = async (data) => {
    const createdUser = await User.create(data)
    return createdUser;
}
exports.createStatus = async (data) => {
    const status = await UserStatus.create(data)
    return status;
}
exports.createCategory = async (data) => {
    const category = await UserCategory.create(data)
    return category;
}