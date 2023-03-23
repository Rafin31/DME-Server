const Staff = require("../../model/Staff.model")
const User = require("../../model/User.model")
const Invited_Staff = require("../../model/InvitedStaff.model")
const DME_Supplier = require("../../model/DmeSupplier.model")

exports.getAllStaffService = async () => {
    const staff = await Staff.find({})
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
exports.getAllInvitedStaffService = async (adminId) => {

    const staff = await Invited_Staff.find({ admin: adminId }).select('email inviteToken')
    return staff
}

exports.deleteInvitedStaffService = async (token) => {


    const staff = await Invited_Staff.deleteOne({ inviteToken: token })

    const dmeWithToken = await DME_Supplier.find({ inviteToken: { "$in": [token] } })

    const deleteDmeToken = await DME_Supplier.updateOne({ _id: dmeWithToken[0]._id }, { $pull: { inviteToken: token } })

    return { dmeWithToken, deleteDmeToken }
}

exports.deleteRegisteredStaffService = async (id) => {


    const staff = await Staff.deleteOne({ userId: id })
    const user = await User.deleteOne({ _id: id })

    const dmeWithId = await DME_Supplier.find({ staff: { "$in": [id] } })

    const deleteStaffFromDme = await DME_Supplier.updateOne({ _id: dmeWithId[0]._id }, { $pull: { staff: id } })

    return { staff, deleteStaffFromDme }
}