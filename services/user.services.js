const User = require('../model/User.model');
const UserStatus = require('../model/UserStatus.model');
const UserCategory = require('../model/UserCategory.model');
const { db } = require('../model/User.model');
const DME_Supplier = require('../model/DmeSupplier.model');

// https://www.ultimateakash.com/blog-details/IiwzQGAKYAo=/How-to-implement-Transactions-in-Mongoose-&-Node.Js-(Express)

const findUserCategory = async (id) => {
    const category = await UserCategory.findById(id).select("-_id category");
    return category;
}

exports.getAllUser = async () => {
    const user = await User.find({})
        .lean()
        .populate({ path: 'status', select: '-_id -updatedAt -createdAt -__v' })
        .populate({ path: 'userCategory', select: '-_id -updatedAt -createdAt -__v' })
    return user;
}

exports.createUserService = async (data) => {

    const session = await db.startSession();
    try {
        session.startTransaction();
        const createdUser = await User.create([data], { session })
        const createdUserCategory = await UserCategory.findById(createdUser[0]?.userCategory).session(session)

        if (createdUserCategory?.category === "DME-Supplier") {
            const DME_data = {
                userId: createdUser[0]?._id,
                companyName: data?.companyName,
                npiNumber: data?.npiNumber,
                phoneNumber: data?.phoneNumber,
                country: data?.country,
                city: data?.city,
                state: data?.state,
                zip: data?.zip,
                address: data?.address,
            }
            await DME_Supplier.create([DME_data], { session })
        }
        await session.commitTransaction();
        return createdUser

    } catch (error) {
        await session.abortTransaction();
        throw new Error(error)
    } finally {
        session.endSession();
    }
}

exports.createStatus = async (data) => {
    const status = await UserStatus.create(data)
    return status;
}

exports.createCategory = async (data) => {
    const category = await UserCategory.create(data)
    return category;
}
