const VeteranOrder = require("../../model/VeteranOrder.model")
const Veteran = require("../../model/Veteran.model")
const Veteran_Order_Note = require("../../model/VeteranOrderNote.model")
const { findUserByIdService } = require("../UserServices/user.services")
const moment = require('moment');


exports.createVeteranOrderService = async (data) => {
    if (data.firstAttempt) {
        data.firstAttempt = moment.utc(data.firstAttempt, 'M/D/YYYY').format('MM-DD-YYYY')
    }
    if (data.secondAttempt) {
        data.secondAttempt = moment.utc(data.secondAttempt, 'M/D/YYYY').format('MM-DD-YYYY')
    }
    if (data.schedule) {
        data.schedule = moment.utc(data.schedule, 'M/D/YYYY').format('MM-DD-YYYY')
    }

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
        .select('-__v -createdAt -updatedAt')

    return veteranOrder

}

exports.getVeteranOrderbyIdService = async (id) => {

    const veteranOrder = await VeteranOrder.find({ _id: id })
        .lean()
        .populate({ path: "dmeSupplierId", select: "fullName email" })
        .populate({ path: "veteranId", select: "fullName email" })
        .populate({ path: "document", select: "-updatedAt -__v" })
        .select('-__v -createdAt -updatedAt')

    return veteranOrder
}


exports.getVeteranOrderByCreatorIdService = async (id) => {
    let veteran = []
    const order = await VeteranOrder.find({ $and: [{ status: { $ne: "Archived" } }, { dmeSupplierId: id }] })
        .lean()
        .populate({ path: "dmeSupplierId", select: "fullName email" })
        .populate({ path: "veteranId", select: "firstName lastName  fullName email" })
        .select('-__v -updatedAt')
    return order

}

exports.getVeteranOrderByVeteranService = async (id) => {
    const order = await VeteranOrder.find({ veteranId: id })
        .lean()
        .populate({ path: "dmeSupplierId", select: "_id fullName email" })
        .populate({ path: "veteranId", })
        .select('-__v')


    // order.veteranId._id

    for (const or of order) {
        const veteran = await Veteran.find({ userId: or.veteranId._id }).select("lastFour")
        or.veteranId.lastFour = veteran[0].lastFour
    }


    return order
}

exports.updateVeteranOrderService = async (data, id) => {

    if (data.firstAttempt) {
        data.firstAttempt = moment.utc(data.firstAttempt, 'M/D/YYYY').format('MM-DD-YYYY')
    }
    if (data.secondAttempt) {
        data.secondAttempt = moment.utc(data.secondAttempt, 'M/D/YYYY').format('MM-DD-YYYY')
    }
    if (data.schedule) {
        data.schedule = moment.utc(data.schedule, 'M/D/YYYY').format('MM-DD-YYYY')
    }
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

exports.deleteOrderService = async (id) => {

    const order = await VeteranOrder.findById(id)

    if (!order) return order

    const documents = order.document

    for (const id of documents) {
        await Document.findByIdAndDelete(id)
    }
    await Veteran_Order_Note.deleteMany({ orderId: id })

    const deleteOrder = await VeteranOrder.findByIdAndDelete(id)
    return deleteOrder

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
    if (notes.length !== 0) {
        for (const note of notes) {
            let writer = await findUserByIdService(note.writerId._id)
            const noteObj = note.toObject()
            noteObj.writerId.companyName = writer?.details?.companyName
            notes[notes.indexOf(note)] = noteObj
        }
    }
    return notes
}

exports.deleteVeteranOrderNoteByIdService = async (id) => {
    const deleted = await Veteran_Order_Note.deleteOne({ _id: id })
    return deleted
}


exports.getVeteranOrderByStatusService = async (status) => {
    const order = await VeteranOrder.find({ status: status })
        .lean()
        .populate({ path: "dmeSupplierId", select: "_id fullName email" })
        .populate({ path: "veteranId", select: "_id fullName email" })
        .select('-__v -createdAt -updatedAt')

    return order
}


exports.getArchiveVeteranOrderService = async (id) => {
    const order = await VeteranOrder.find({ $and: [{ status: "Archived" }, { veteranId: id }] })
        .lean()
        .populate({ path: "dmeSupplierId", select: "_id fullName email" })
        .populate({ path: "veteranId", select: "_id firstName lastName fullName email" })
        .select('-__v -updatedAt')


    for (const or of order) {
        const veteran = await Veteran.find({ userId: or.veteranId._id }).select("lastFour")
        or.veteranId.lastFour = veteran[0].lastFour
    }

    return order
}


exports.publishNotesByOrderIdService = async (orderId, data) => {
    let insertNote = await Veteran_Order_Note.create({
        writerId: data.writerId,
        orderId: orderId,
        notes: data.notes
    })

    return insertNote;

}

