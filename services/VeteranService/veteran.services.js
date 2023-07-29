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
        .populate({ path: "dmeSupplier", select: "fullName email" })
        .select('-__v -createdAt -updatedAt')


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
        .populate({ path: "assignedVaProsthetic", select: "fullName email" })
        .populate({ path: "dmeSupplier", select: "fullName email" })
        .select('-__v -createdAt -updatedAt')

    return veteran
}