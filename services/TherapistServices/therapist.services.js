const Therapist = require("../../model/Therapist.model")

exports.getAllTherapistService = async () => {
    const therapist = await Therapist.find({})
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
        .populate({ path: "patient", select: "_id email fullName" })
        .select('-__v -createdAt -updatedAt')

    console.log(therapist);

    return therapist
}