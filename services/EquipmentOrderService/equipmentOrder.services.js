const EquipmentOrder = require("../../model/EquipmentOrder.model")
const Equipment_Order_Note = require("../../model/EquipmentOrderNote.model")
const Patient = require("../../model/Patient.model")
const { findUserByIdService } = require("../UserServices/user.services")

exports.createOrderService = async (data) => {
    const order = await EquipmentOrder.create(data)
    return order
    // let insertNote
    // if (data.note) {
    //     insertNote = await Equipment_Order_Note.create({
    //         writerId: data.dmeSupplierId,
    //         orderId: order._id,
    //         note: data.note
    //     })
    //     order.notes = insertNote._id
    //     order.save({ runValidators: false })
    // }
}

exports.getAllOrderService = async () => {
    const orders = await EquipmentOrder.find({})
        .lean()
        .populate({ path: "dmeSupplierId", select: "_id fullName email" })
        .populate({ path: "patientId", select: "_id fullName email" })
        .populate({
            path: "notes",
            populate: {
                path: 'writerId',
                select: "_id fullName email"
            }
        })
        .select('-__v -createdAt -updatedAt')

    return orders
}

exports.getOrderByIdService = async (id) => {
    const order = await EquipmentOrder.findById(id)
        .lean()
        .populate({ path: "dmeSupplierId", select: "-password -updatedAt -__v" })
        .populate({ path: "patientId", select: "-password -updatedAt -__v" })
        .populate({ path: "notes", select: "-updatedAt -__v" })
        .populate({ path: "document", select: "-updatedAt -__v" })
        .select('-__v -createdAt -updatedAt')

    return order
}

exports.getOrderByDmeSupplierService = async (id) => {
    const order = await EquipmentOrder.find({ $and: [{ status: { $ne: "Archived" } }, { dmeSupplierId: id }] })
        .lean()
        .populate({ path: "dmeSupplierId", select: "_id fullName email" })
        .populate({ path: "patientId", select: "_id fullName email" })
        .populate({ path: "notes", select: "-updatedAt -__v" })
        .select('-__v -updatedAt')

    if (order.length !== 0) {
        for (const or of order) {
            const patientDob = await Patient.find({ userId: or.patientId._id }).lean().select("dob")
            or.patientId.patientDob = await patientDob[0].dob
        }
    }

    return order
}

exports.getOrderByPatientService = async (id) => {
    const order = await EquipmentOrder.find({ patientId: id })
        .lean()
        .populate({ path: "dmeSupplierId", select: "_id fullName email" })
        .populate({ path: "patientId", select: "_id fullName email" })
        .select('-__v -createdAt -updatedAt')

    if (order.length !== 0) {
        for (const or of order) {
            const patientDob = await Patient.find({ userId: or.patientId._id }).lean().select("dob")
            or.patientId.patientDob = await patientDob[0].dob
        }
    }

    return order
}

exports.getOrderByStatusService = async (status) => {
    const order = await EquipmentOrder.find({ status: status })
        .lean()
        .populate({ path: "dmeSupplierId", select: "_id fullName email" })
        .populate({ path: "patientId", select: "_id fullName email" })
        .select('-__v -updatedAt')

    if (order.length !== 0) {
        for (const or of order) {
            const patientDob = await Patient.find({ userId: or.patientId._id }).lean().select("dob")
            or.patientId.patientDob = await patientDob[0].dob
        }
    }

    return order
}

exports.getArchiveOrderService = async (id) => {
    const order = await EquipmentOrder.find({ $and: [{ status: "Archived" }, { patientId: id }] })
        .lean()
        .populate({ path: "dmeSupplierId", select: "_id fullName email" })
        .populate({ path: "patientId", select: "_id fullName email" })
        .populate({ path: "notes", select: "-updatedAt -__v" })
        .select('-__v -updatedAt')

    if (order.length !== 0) {
        for (const or of order) {
            const patientDob = await Patient.find({ userId: or.patientId._id }).lean().select("dob")
            or.patientId.patientDob = await patientDob[0].dob
        }
    }

    return order
}

exports.updateOrderService = async (data, id) => {

    const update = await EquipmentOrder.updateOne({ _id: id }, { $set: data }, { runValidators: true })
    return update
}

//notes
exports.insertOrderNoteService = async (data, orderId) => {
    let insertNote = await Equipment_Order_Note.create({
        writerId: data.writerId,
        orderId: orderId,
        notes: data.notes
    })

    // const updateOrder = await EquipmentOrder.updateOne({ _id: orderId }, { $set: { notes: insertNote._id } }, { runValidators: true })
    return insertNote;
}


exports.getNotesByOrderIdService = async (orderId) => {
    let notes = await Equipment_Order_Note.find({ orderId: orderId })
        .populate(
            {
                path: 'writerId', select: "-password",
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
