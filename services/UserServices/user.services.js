const User = require('../../model/User.model');
const UserStatus = require('../../model/UserStatus.model');
const UserCategory = require('../../model/UserCategory.model');
const Patient = require('../../model/Patient.model');
const Veteran = require('../../model/Veteran.model');
const VA_Prosthetics = require('../../model/VaProsthetics.model');
const DME_Supplier = require('../../model/DmeSupplier.model');
const Doctor = require('../../model/Doctor.model');
const Therapist = require('../../model/Therapist.model');
const Staff = require('../../model/Staff.model');
const Invited_Staff = require("../../model/InvitedStaff.model")
const Invited_VA_Prosthetics = require("../../model/InvitedVaProsthetics.model")
const { db } = require('../../model/User.model');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const { sendMail } = require('../../utils/sentEmail');


// https://www.ultimateakash.com/blog-details/IiwzQGAKYAo=/How-to-implement-Transactions-in-Mongoose-&-Node.Js-(Express)

exports.getAllUserService = async () => {
    const user = await User.find({})
        .lean()
        .populate({ path: 'status', select: ' -updatedAt -createdAt -__v' })
        .populate({ path: 'userCategory', select: '-updatedAt -createdAt -__v' })
        .select('-password -updatedAt -createdAt -__v')
    return user;
}

exports.getAllActiveUserService = async () => {
    const user = await User.find({ status: "63861954b3b3ded1ee267309" })
        .lean()
        .populate({ path: 'status', select: ' -updatedAt -createdAt -__v' })
        .populate({ path: 'userCategory', select: '-updatedAt -createdAt -__v' })
        .select('-password -updatedAt -createdAt -__v')
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

        if (createdUserCategory?.category === "Doctor") {
            const doctorData = {
                userId: createdUser[0]?._id,
                companyName: data?.companyName,
                title: data?.title,
                npiNumber: data?.npiNumber,
                phoneNumber: data?.phoneNumber,
                country: data?.country,
                city: data?.city,
                state: data?.state,
                zip: data?.zip,
                address: data?.address,
            }
            await Doctor.create([doctorData], { session })
        }

        if (createdUserCategory?.category === "Therapist") {
            const therapistData = {
                userId: createdUser[0]?._id,
                companyName: data?.companyName,
                title: data?.title,
                npiNumber: data?.npiNumber,
                phoneNumber: data?.phoneNumber,
                country: data?.country,
                city: data?.city,
                state: data?.state,
                zip: data?.zip,
                address: data?.address,
            }
            await Therapist.create([therapistData], { session })
        }

        if (createdUserCategory?.category === "Veteran") {
            const veteranData = {
                userId: createdUser[0]?._id,
                phoneNumber: data?.phoneNumber,
                country: data?.country,
                city: data?.city,
                state: data?.state,
                zip: data?.zip,
                address: data?.address,
                document: data?.document,
                lastFour: data?.lastFour,
                dmeSupplier: data?.dmeSupplier
            }
            await Veteran.create([veteranData], { session })
        }

        if (createdUserCategory?.category === "VA Prosthetics") {
            if (!data.inviteToken) {
                throw new Error("You are not allowed to signup. Contact with DME-Supplier ")
            }

            const dmeWithToken = await DME_Supplier.findOne({ inviteToken: data.inviteToken })
                .populate({ path: "userId", select: "_id" })

            if (!dmeWithToken) {
                throw new Error("You are not allowed to signup. Contact with your DME-Supplier")
            }

            const vaProstheticsData = {
                userId: createdUser[0]?._id,
                phoneNumber: data?.phoneNumber,
                admin: dmeWithToken.userId._id
            }

            await VA_Prosthetics.create([vaProstheticsData], { session })
            await Invited_VA_Prosthetics.deleteOne({ inviteToken: data.inviteToken })

            dmeWithToken.va_prosthetics.push(createdUser[0]?._id)
            dmeWithToken.inviteToken.pull(data.inviteToken)
            dmeWithToken.save({ validateModifiedOnly: true })
        }

        if (createdUserCategory?.category === "Patient") {
            const patientData = {
                userId: createdUser[0]?._id,
                gender: data?.gender,
                dob: data?.dob ? moment.utc(data.dob, 'M/D/YYYY').format('MM-DD-YYYY') : "",
                weight: data?.weight,
                phoneNumber: data?.phoneNumber,
                country: data?.country,
                city: data?.city,
                state: data?.state,
                zip: data?.zip,
                primaryInsurance: data?.primaryInsurance,
                secondaryInsurance: data?.secondaryInsurance,
                address: data?.address,
                document: data?.document,
                dmeSupplier: data?.dmeSupplier
            }
            await Patient.create([patientData], { session })
        }

        if (createdUserCategory?.category === "DME-Staff") {
            if (!data.inviteToken) {
                throw new Error("You are not allowed to signup. Contact with DME-Supplier ")
            }

            const dmeWithToken = await DME_Supplier.findOne({ inviteToken: data.inviteToken })
                .populate({ path: "userId", select: "_id" })

            if (!dmeWithToken) {
                throw new Error("You are not allowed to signup. Contact with your DME-Supplier ")
            }

            const staffData = {
                userId: createdUser[0]?._id,
                companyName: dmeWithToken?.companyName,
                npiNumber: dmeWithToken?.npiNumber,
                phoneNumber: dmeWithToken?.phoneNumber,
                country: dmeWithToken?.country,
                city: dmeWithToken?.city,
                state: dmeWithToken?.state,
                zip: dmeWithToken?.zip,
                address: dmeWithToken?.address,
                admin: dmeWithToken.userId._id,
                banner: dmeWithToken?.banner
            }
            await Staff.create([staffData], { session })
            await Invited_Staff.deleteOne({ inviteToken: data.inviteToken })

            dmeWithToken.staff.push(createdUser[0]?._id)
            dmeWithToken.inviteToken.pull(data.inviteToken)
            dmeWithToken.save({ validateModifiedOnly: true })

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
    let updateUser
    try {
        session.startTransaction();
        const user = await User.findById(id).session(session)

        if (!user) {
            throw new Error("User not found!")
        }

        const userCategory = await UserCategory.findById(user?.userCategory).select("-_id category").session(session)

        if (data.password || data.newPassword) {
            if (data.password && data.newPassword) {
                const isPasswordValid = user.comparePassword(data.password, user.password)

                if (!isPasswordValid) {
                    throw new Error("Password didn't matched!")
                }
                const salt = bcrypt.genSaltSync(10);
                const hashedPassword = bcrypt.hashSync(data.newPassword, salt);
                const { password, newPassword, ...others } = data
                data = {
                    ...others,
                    password: hashedPassword
                }
            } if (data.password && (userCategory.category === "Patient" || userCategory.category === "Veteran")) {
                const salt = bcrypt.genSaltSync(10);
                const hashedPassword = bcrypt.hashSync(data.password, salt);
                const { password, ...others } = data
                data = {
                    ...others,
                    password: hashedPassword
                }
            } else {
                throw new Error("Give current password and new password!")
            }

        }
        if (data.email) {

            const user = await User.findById(id);
            user.email = data.email;
            await user.save();

        } else {
            updateUser = await User.updateOne({ _id: id }, { $set: data }, { runValidators: true }).session(session)
        }

        if (userCategory.category === "Doctor") {
            await Doctor.updateOne({ userId: user._id }, { $set: data }, { runValidators: true }).session(session)
        }
        if (userCategory.category === "Therapist") {
            await Therapist.updateOne({ userId: user._id }, { $set: data }, { runValidators: true }).session(session)
        }

        if (userCategory.category === "DME-Supplier") {
            await DME_Supplier.updateOne({ userId: user._id }, { $set: data }, { runValidators: true }).session(session)
        }
        if (userCategory.category === "Patient") {
            if (data.dob) {
                const dobMoment = moment.utc(data.dob, 'M/D/YYYY');
                data.dob = dobMoment.format('MM-DD-YYYY');
            }
            await Patient.updateOne({ userId: user._id }, { $set: data }, { runValidators: true }).session(session)
        }
        if (userCategory.category === "DME-Staff") {
            await Staff.updateOne({ userId: user._id }, { $set: data }, { runValidators: true }).session(session)
        }
        if (userCategory.category === "Veteran") {
            await Veteran.updateOne({ userId: user._id }, { $set: data }, { runValidators: true }).session(session)
        }
        if (userCategory.category === "VA Prosthetics") {
            await VA_Prosthetics.updateOne({ userId: user._id }, { $set: data }, { runValidators: true }).session(session)
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

exports.deleteUserService = async (id) => {
    const session = await db.startSession();
    try {
        session.startTransaction();
        const user = await User.findById(id)
            .populate({ path: 'userCategory', select: '-updatedAt -createdAt -__v' })
            .session(session)

        if (!user) {
            throw new Error("User not found!")
        }

        if (user.userCategory.category !== "DME-Supplier" && user.userCategory.category !== "Patient" && user.userCategory.category !== "DME-Staff") {
            throw new Error("Not Allowed!")
        }

        if (user.userCategory.category === "DME-Supplier") {
            const dme = await DME_Supplier.findOne({ userId: user._id })
                .select('_id')
                .session(session)

            if (!dme) {
                throw new Error("User not found!")
            }

            await DME_Supplier.deleteOne({ _id: dme._id }).session(session)
        }
        if (user.userCategory.category === "Patient") {
            const patient = await Patient.findOne({ userId: user._id })
                .select('_id userId')
                .session(session)

            if (!patient) {
                throw new Error("User not found!")
            }

            const doctor = await Doctor.findOne({ "patient": { "$in": patient.userId } })
            const therapist = await Therapist.findOne({ "patient": { "$in": patient.userId } })

            if (doctor) {
                await Doctor.updateOne({ _id: doctor._id }, { $pull: { patient: patient.userId } })
            }
            if (therapist) {
                await Therapist.updateOne({ _id: therapist._id }, { $pull: { patient: patient.userId } })
            }

            await Patient.deleteOne({ _id: patient._id }).session(session)
        }
        if (user.userCategory.category === "DME-Staff") {
            const staff = await Staff.findOne({ userId: user._id })
                .select('userId')
                .session(session)

            if (!staff) {
                throw new Error("User not found!")
            }

            const dme = await DME_Supplier.findOne({ "staff": { "$in": user._id } })
            await DME_Supplier.updateOne({ _id: dme._id }, { $pull: { staff: staff.userId } })
            await Staff.deleteOne({ _id: staff._id }).session(session)
        }


        await User.deleteOne({ _id: user._id }).session(session)

        await session.commitTransaction();
        return "Deleted"

    } catch (error) {
        await session.abortTransaction();
        throw new Error(error)
    } finally {
        session.endSession();
    }

}

exports.findUserByEmailService = async (email) => {
    const user = await User.findOne({ email })
    return user;
}

exports.findUserByIdService = async (id) => {

    let user = await User.findById(id)
        .lean()
        .populate({ path: 'status', select: ' -updatedAt -createdAt -__v' })
        .populate({ path: 'userCategory', select: '-updatedAt -createdAt -__v' })
        .select('-password -updatedAt -createdAt -__v');

    if (!user) {
        return user
    }

    if (user.userCategory.category === "DME-Supplier") {
        const details = await DME_Supplier.findOne({ userId: user._id })
            .populate({ path: "staff", select: "_id email " })
            .select('-_id -userId -updatedAt -createdAt -__v')
        user = { ...user, details }
    }
    if (user.userCategory.category === "DME-Staff") {
        const details = await Staff.findOne({ userId: user._id })
            .select('-_id -userId -updatedAt -createdAt -__v')
            .populate({ path: "admin", select: "_id userId email " })
        user = { ...user, details }
    }

    if (user.userCategory.category === "Patient") {
        const details = await Patient
            .findOne({ userId: user._id })
            .populate({ path: "document", select: ' -updatedAt -__v' })
            .populate({ path: "doctor", select: ' _id fullName email' })
            .populate({ path: "therapist", select: ' _id fullName email' })
            .select('-_id -userId -updatedAt -createdAt -__v')
        user = { ...user, details }
    }

    if (user.userCategory.category === "Veteran") {
        const details = await Veteran
            .findOne({ userId: user._id })
            .populate({ path: "document", select: ' -updatedAt -__v' })
            .populate({ path: "assignedVaProsthetic", select: ' _id fullName email' })
            .populate({ path: "dmeSupplier", select: ' _id fullName email' })
            .select('-_id -userId -updatedAt -createdAt -__v')
        user = { ...user, details }
    }

    if (user.userCategory.category === "VA Prosthetics") {
        const details = await VA_Prosthetics
            .findOne({ userId: user._id })
            .populate({ path: "admin", select: "_id userId email " })
            .select('-_id -userId -updatedAt -createdAt -__v')
        user = { ...user, details }
    }

    if (user.userCategory.category === "Doctor") {
        const details = await Doctor.findOne({ userId: user._id })
            .populate({ path: "patient", select: "_id email " })
            .select('-_id -userId -updatedAt -createdAt -__v')
        user = { ...user, details }
    }
    if (user.userCategory.category === "Therapist") {
        const details = await Therapist.findOne({ userId: user._id })
            .populate({ path: "patient", select: "_id email " })
            .select('-_id -userId -updatedAt -createdAt -__v')
        user = { ...user, details }
    }


    return user

}

exports.findUserStatusService = async (email) => {
    const user = await User.findOne({ email })
    const userStatus = await UserStatus.findById(user?.status).select("-_id status")
    return userStatus.status;
}

exports.findUserCategoryService = async (email) => {
    const user = await User.findOne({ email })
    const userCategory = await UserCategory.findById(user?.userCategory)
    return userCategory;
}

exports.importPatientService = async (data) => {

    const session = await db.startSession();
    try {
        session.startTransaction();
        const users = await User.insertMany(data, { session }) //will insert value which are correct

        const patientData = data.map((patient, index) => (
            {
                ...patient,
                userId: users[index]._id
            }
        ))
        await Patient.insertMany(patientData, { session }) //will insert value which are correct
        await session.commitTransaction();
        return users

    } catch (error) {
        await session.abortTransaction();
        throw error
    } finally {
        session.endSession();
    }
}

exports.importDoctorService = async (data) => {

    const session = await db.startSession();
    try {
        session.startTransaction();
        const users = await User.insertMany(data, { session }) //will insert value which are correct

        const doctorData = data.map((doctor, index) => (
            {
                ...doctor,
                userId: users[index]._id
            }
        ))
        await Doctor.insertMany(doctorData, { session }) //will insert value which are correct
        await session.commitTransaction();
        return users

    } catch (error) {
        await session.abortTransaction();
        throw error
    } finally {
        session.endSession();
    }
}
exports.importVeteranService = async (data) => {

    const session = await db.startSession();
    try {
        session.startTransaction();
        const users = await User.insertMany(data, { session }) //will insert value which are correct

        const veteranData = data.map((veteran, index) => (
            {
                ...veteran,
                userId: users[index]._id
            }
        ))
        await Veteran.insertMany(veteranData, { session }) //will insert value which are correct
        await session.commitTransaction();
        return users

    } catch (error) {
        await session.abortTransaction();
        throw error
    } finally {
        session.endSession();
    }
}


exports.getAllPatientService = async () => {
    const patients = await Patient.find({})
        .lean()
        .populate({ path: "userId", select: '-_id -updatedAt -createdAt -status -userCategory -password -__v' })
        .select('-updatedAt -createdAt -__v -_id')
    return patients
}
exports.getAllPatientByDMEService = async (dmeSupplier) => {
    const patients = Patient.find({
        $and: [
            { status: { $eq: "63861954b3b3ded1ee267309" } },//status active
            { dmeSupplier: dmeSupplier }
        ]
    })
        .lean()
        .populate({ path: "userId", select: '-_id -updatedAt -createdAt -status -userCategory -password -__v' })
        .select('-updatedAt -createdAt -__v -_id')
    return patients
}
exports.getAllDmeSupplierService = async () => {
    const dme = await DME_Supplier.find({})
        .lean()
        .populate({ path: "userId", select: '-_id -updatedAt -createdAt -status -userCategory -password -__v' })
        .select('-updatedAt -createdAt -__v -_id')

    return dme
}
exports.getAllDoctorService = async () => {
    const doctor = await Doctor.find({})
        .lean()
        .populate({ path: "userId", select: '-_id -updatedAt -createdAt -status -userCategory -password -__v' })
        .select('-updatedAt -createdAt -__v -_id')

    return doctor
}
exports.getAllVeteranService = async () => {
    const veteran = await Veteran.find({})
        .lean()
        .populate({ path: "userId", select: '-_id -updatedAt -createdAt -status -userCategory -password -__v' })
        .select('-updatedAt -createdAt -__v -_id')

    return veteran
}
exports.getAllVeteranByDMEService = async (dmeSupplier) => {
    const veteran = Veteran.find({
        $and: [
            { status: { $eq: "63861954b3b3ded1ee267309" } },//status active
            { dmeSupplier: dmeSupplier }
        ]
    })
        .lean()
        .populate({ path: "userId", select: '-_id -updatedAt -createdAt -status -userCategory -password -__v' })
        .select('-updatedAt -createdAt -__v -_id')

    return veteran
}


//get Patient By UserId 
exports.getPatientByUserIdService = async (id) => {

    const patients = await Patient.findOne({ userId: id })
        .lean()
        .populate({
            path: "userId",
            select: '-updatedAt -createdAt -password -__v',
            populate: [
                {
                    path: 'userCategory',
                    select: '-_id -updatedAt -createdAt -__v',
                },
                {
                    path: 'status',
                    select: '-_id -updatedAt -createdAt -__v',
                }
            ]
        })
        .select('-updatedAt -createdAt -__v -_id')

    return patients
}

//get DME By UserId 
exports.getDmeSupplierByUserIdService = async (id) => {

    const dme = await DME_Supplier.findOne({ userId: id })
        .lean()
        .populate({
            path: "userId",
            select: '-updatedAt -createdAt -password -__v',
            populate: [
                {
                    path: 'userCategory',
                    select: '-_id -updatedAt -createdAt -__v',
                },
                {
                    path: 'status',
                    select: '-_id -updatedAt -createdAt -__v',
                }
            ]
        })
        .select('-updatedAt -createdAt -__v -_id')

    return dme
}

exports.createStatusService = async (data) => {
    const status = await UserStatus.create(data)
    return status;
}

exports.createCategoryService = async (data) => {
    const category = await UserCategory.create(data)
    return category;
}

exports.sendMailService = async (emailBody, email) => {
    try {
        const sentEmail = sendMail(emailBody, email);
        return sentEmail
    } catch (error) {
        throw new Error(error)
    }
}

exports.findUserByToken = async (token) => {
    const user = await User.findOne({ token: token })
    return user
}

