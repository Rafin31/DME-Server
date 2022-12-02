const User = require('../../model/User.model');
const UserStatus = require('../../model/UserStatus.model');
const UserCategory = require('../../model/UserCategory.model');
const Patient = require('../../model/Patient.model');
const { db } = require('../../model/User.model');
const DME_Supplier = require('../../model/DmeSupplier.model');

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
        .select('-updatedAt -createdAt -__v')
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
        if (createdUserCategory?.category === "Patient") {
            const patientData = {
                userId: createdUser[0]?._id,
                gender: data?.gender,
                dob: data?.dob,
                weight: data?.weight,
                phoneNumber: data?.phoneNumber,
                country: data?.country,
                city: data?.city,
                state: data?.state,
                primaryInsurance: data?.primaryInsurance,
                secondaryInsurance: data?.secondaryInsurance,
                address: data?.address,
                document: data?.document,
            }
            await Patient.create([patientData], { session })
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

exports.updateUserService = async (id, data) => {
    const session = await db.startSession();
    try {
        session.startTransaction();
        const user = await User.findById(id).session(session)
        const updateUser = await User.updateOne({ _id: id }, { $set: data }, { runValidators: true }).session(session)

        const userCategory = await UserCategory.findById(user?.userCategory).select("-_id category").session(session)

        if (userCategory.category === "DME-Supplier") {
            await DME_Supplier.updateOne({ userId: user._id }, { $set: data }, { runValidators: true }).session(session)
        }

        await session.commitTransaction();
        return updateUser;
    } catch (error) {
        await session.abortTransaction();
        throw new Error(error)
    } finally {
        session.endSession();
    }
}

exports.findUserByEmail = async (email) => {
    const user = await User.findOne({ email })
    return user;
}

exports.findUserStatus = async (email) => {
    const user = await User.findOne({ email })
    const userStatus = await UserStatus.findById(user?.status).select("-_id status")
    return userStatus.status;
}

exports.findUserCategory = async (email) => {
    const user = await User.findOne({ email })
    const userCategory = await UserCategory.findById(user?.userCategory)
    return userCategory;
}

exports.createStatus = async (data) => {
    const status = await UserStatus.create(data)
    return status;
}

exports.createCategory = async (data) => {
    const category = await UserCategory.create(data)
    return category;
}
