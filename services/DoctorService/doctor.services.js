const Doctor = require("../../model/Doctor.model")

exports.getAllDoctorService = async () => {
    const doctors = await Doctor.find({})
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
        .populate({ path: "patient", select: "_id fullName email" })
        .select('-__v -createdAt -updatedAt')

    return doctors
}
