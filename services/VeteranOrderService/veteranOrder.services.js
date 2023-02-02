const VeteranOrder = require("../../model/VeteranOrder.model")
const Veteran_Order_Note = require("../../model/VeteranOrderNote.model")


exports.createVeteranOrderService = async (data) => {

    const veteranOrder = await VeteranOrder.create(data)
    let insertNote
    if (data.note) {
        insertNote = await Veteran_Order_Note.create({
            writerId: data.creatorId,
            orderId: veteranOrder._id,
            note: data.note
        })
        veteranOrder.notes = insertNote._id
        veteranOrder.save({ runValidators: false })
    }

    return veteranOrder

}

exports.getAllVeteranOrderService = async () => {

    const veteranOrder = await VeteranOrder.find({})
        .lean()
        .populate({ path: "creatorId", select: "_id fullName email" })
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
        .populate({ path: "creatorId", select: "fullName email" })
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
    const order = await VeteranOrder.find({ creatorId: id })
        .lean()
        .populate({ path: "creatorId", select: "_id fullName email" })
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

exports.getVeteranOrderByVeteranService = async (id) => {
    const order = await VeteranOrder.find({ veteranId: id })
        .lean()
        .populate({ path: "creatorId", select: "_id fullName email" })
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
    let insertNote
    if (data.note) {
        insertNote = await Veteran_Order_Note.create({
            writerId: data.creatorId,
            orderId: id,
            note: data.note
        })
        await VeteranOrder.updateOne({ _id: id }, { $set: { notes: insertNote._id } }, { runValidators: true })
    }
    return update
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
        .select("note")
    return notes
}


exports.getVeteranOrderByStatusService = async (status) => {
    const order = await VeteranOrder.find({ status: status })
        .lean()
        .populate({ path: "creatorId", select: "_id fullName email" })
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
