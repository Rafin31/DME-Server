const Veteran = require("../../model/Veteran.model")

exports.getAllVeteranService = async () => {
    const veteran = await Veteran.find({})
        .lean()
        .populate(
            {
                path: "userId",
                populate: [
                    {
                        path: 'status',
                        select: "status -_id"
                    },
                    {
                        path: 'userCategory',
                        select: "category -_id"
                    },
                ],
                select: "-password -updatedAt -createdAt -__v"
            })
        .populate({ path: "assignedVaProsthetic", select: "fullName" })
        .select('-__v -createdAt -updatedAt')


    return veteran
}