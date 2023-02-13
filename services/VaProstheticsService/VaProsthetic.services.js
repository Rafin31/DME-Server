const User = require("../../model/User.model")
const Invited_VA_Prosthetics = require("../../model/InvitedVaProsthetics.model")
const DME_Supplier = require("../../model/DmeSupplier.model")
const VA_Prosthetics = require("../../model/VaProsthetics.model")

exports.getAllVAService = async () => {
    const staff = await VA_Prosthetics.find({})
        .lean()
        .populate(
            {
                path: "userId",
                populate: [
                    {
                        path: 'status',
                        select: "status"
                    },
                    {
                        path: 'userCategory',
                        select: "category"
                    },
                ],
                select: "-password -updatedAt -createdAt -__v"
            })

        .select('-__v -createdAt -updatedAt')

    return staff
}

exports.getAllInvitedVAService = async (adminId) => {

    const va_prosthetic = await Invited_VA_Prosthetics.find({ admin: adminId }).select('email inviteToken')
    return va_prosthetic
}

exports.deleteInvitedVAService = async (token) => {


    const va_prosthetic = await Invited_VA_Prosthetics.deleteOne({ inviteToken: token })

    const dmeWithToken = await DME_Supplier.find({ inviteToken: { "$in": [token] } })

    const deleteDmeToken = await DME_Supplier.updateOne({ _id: dmeWithToken[0]._id }, { $pull: { inviteToken: token } })

    return { dmeWithToken, deleteDmeToken }
}

exports.deleteRegisteredVAService = async (id) => {


    const va_prosthetic = await VA_Prosthetics.deleteOne({ userId: id })
    const user = await User.deleteOne({ _id: id })

    const dmeWithId = await DME_Supplier.find({ va_prosthetics: { "$in": [id] } })

    const deleteStaffFromDme = await DME_Supplier.updateOne({ _id: dmeWithId[0]._id }, { $pull: { va_prosthetics: id } })

    return { staff: va_prosthetic, deleteStaffFromDme }
}