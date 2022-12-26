const Staff = require("../../model/Staff.model")

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