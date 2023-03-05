const VeteranOrder = require("../../model/VeteranOrder.model")
const Veteran = require("../../model/Veteran.model")
const Veteran_Order_Note = require("../../model/VeteranOrderNote.model")


exports.createVeteranOrderService = async (data) => {

    const veteranOrder = await VeteranOrder.create(data)
    return veteranOrder

    // let insertNote
    // if (data.note) {
    //     insertNote = await Veteran_Order_Note.create({
    //         writerId: data.dmeSupplierId,
    //         orderId: veteranOrder._id,
    //         note: data.note
    //     })
    //     veteranOrder.notes = insertNote._id
    //     veteranOrder.save({ runValidators: false })
    // }

}

exports.getAllVeteranOrderService = async () => {

    const veteranOrder = await VeteranOrder.find({})
        .lean()
        .populate({ path: "dmeSupplierId", select: "_id fullName email" })
        .populate({ path: "veteranId", select: "_id fullName email" })
        .populate({
            path: "notes",
            populate: {
                path: 'writerId',
                select: "_id fullName email"
            }
        })
        .select('-__v -createdAt -updatedAt')

    return veteranOrder

}

exports.getVeteranOrderbyIdService = async (id) => {

    const veteranOrder = await VeteranOrder.find({ _id: id })
        .lean()
        .populate({ path: "dmeSupplierId", select: "fullName email" })
        .populate({ path: "veteranId", select: "fullName email" })
        .populate({
            path: "notes",
            populate: {
                path: 'writerId',
                select: "_id fullName email"
            }
        })
        .populate({ path: "document", select: "-updatedAt -__v" })
        .select('-__v -createdAt -updatedAt')

    return veteranOrder
}


exports.getVeteranOrderByCreatorIdService = async (id) => {
    let veteran = []
    const order = await VeteranOrder.find({ $and: [{ status: { $ne: "Archived" } }, { dmeSupplierId: id }] })
        .lean()
        .populate({ path: "dmeSupplierId", select: "_id fullName email" })
        .populate({ path: "veteranId", select: "_id firstName lastName  fullName email" })
        .populate({
            path: "notes",
            populate: {
                path: 'writerId',
                select: "_id fullName email"
            }
        })
        .select('-__v -updatedAt')

    return order

}

exports.getVeteranOrderByVeteranService = async (id) => {
    const order = await VeteranOrder.find({ veteranId: id })
        .lean()
        .populate({ path: "dmeSupplierId", select: "_id fullName email" })
        .populate({ path: "veteranId", select: "_id fullName email" })
        .populate({
            path: "notes",
            populate: {
                path: 'writerId',
                select: "_id fullName email"
            }
        })
        .select('-__v -createdAt -updatedAt')

    return order
}

exports.updateVeteranOrderService = async (data, id) => {

    const update = await VeteranOrder.updateOne({ _id: id }, { $set: data }, { runValidators: true })
    return update

    // let insertNote
    // if (data.note) {
    //     insertNote = await Veteran_Order_Note.create({
    //         writerId: data.dmeSupplierId,
    //         orderId: id,
    //         note: data.note
    //     })
    //     await VeteranOrder.updateOne({ _id: id }, { $set: { notes: insertNote._id } }, { runValidators: true })
    // }
}

exports.insertVeteranOrderNoteByIdService = async (data, orderId) => {
    let insertNote = await Veteran_Order_Note.create({
        writerId: data.writerId,
        orderId: orderId,
        notes: data.notes
    })
    return insertNote;
}

exports.getVeteranOrderNoteByIdService = async (orderId) => {
    let notes = await Veteran_Order_Note.find({ orderId: orderId })
        .populate(
            {
                path: 'writerId', select: "fullName email",
                populate: [
                    {
                        path: 'userCategory',
                        select: '-_id category',
                    }
                ]
            }

        )
        .sort("-createdAt")
        .select("notes createdAt")
    return notes
}

exports.getVeteranOrderByStatusService = async (status) => {
    const order = await VeteranOrder.find({ status: status })
        .lean()
        .populate({ path: "dmeSupplierId", select: "_id fullName email" })
        .populate({ path: "veteranId", select: "_id fullName email" })
        .populate({
            path: "notes",
            populate: {
                path: 'writerId',
                select: "_id fullName email"
            }
        })
        .select('-__v -createdAt -updatedAt')

    return order
}


exports.getArchiveVeteranOrderService = async (id) => {
    const order = await VeteranOrder.find({ $and: [{ status: "Archived" }, { veteranId: id }] })
        .lean()
        .populate({ path: "dmeSupplierId", select: "_id fullName email" })
        .populate({ path: "veteranId", select: "_id fullName email" })
        .populate({
            path: "notes",
            populate: {
                path: 'writerId',
                select: "_id fullName email"
            }
        })
        .select('-__v -updatedAt')

    return order
}

