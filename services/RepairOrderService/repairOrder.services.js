
const Patient = require("../../model/Patient.model")
const RepairOrder = require("../../model/RepairOrder.model")
const Repair_Order_Note = require("../../model/RepairOrderNote.model")
const { findUserByIdService } = require("../UserServices/user.services")


exports.createRepairOrderService = async (data) => {

    const repairOrder = await RepairOrder.create(data)
    return repairOrder

    // let insertNote
    // if (data.note) {
    //     insertNote = await Repair_Order_Note.create({
    //         writerId: data.dmeSupplierId,
    //         orderId: repairOrder._id,
    //         note: data.note
    //     })
    //     repairOrder.notes = insertNote._id
    //     repairOrder.save({ runValidators: false })
    // }
}

exports.getAllRepairOrderService = async () => {
    const repairOrder = await RepairOrder.find({})
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

    return repairOrder
}

exports.getRepairOrderbyIdService = async (id) => {
    const order = await RepairOrder.findById(id)
        .lean()
        .populate({ path: "dmeSupplierId", select: "fullName email" })
        .populate({ path: "patientId", select: "fullName email" })
        .populate({
            path: "notes",
            populate: {
                path: 'writerId',
                select: "_id fullName email"
            }
        })
        .populate({ path: "document", select: "-updatedAt -__v" })
        .select('-__v -createdAt -updatedAt')

    return order
}

exports.getRepairOrderByDmeSupplierService = async (id) => {
    const order = await RepairOrder.find({ $and: [{ status: { $ne: "Archived" } }, { dmeSupplierId: id }] })
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
        .select('-__v -updatedAt')

    if (order.length !== 0) {
        for (const or of order) {
            const patientDob = await Patient.find({ userId: or.patientId._id }).lean().select("dob")
            or.patientId.patientDob = await patientDob[0].dob
        }
    }

    return order
}

exports.getRepairOrderByDmePatientService = async (id) => {
    const order = await RepairOrder.find({ patientId: id })
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

    if (order.length !== 0) {
        for (const or of order) {
            const patientDob = await Patient.find({ userId: or.patientId._id }).lean().select("dob")
            or.patientId.patientDob = await patientDob[0].dob
        }
    }

    return order
}


exports.updateRepairOrderService = async (data, id) => {

    const update = await RepairOrder.updateOne({ _id: id }, { $set: data }, { runValidators: true })
    return update

    // let insertNote
    // if (data.note) {
    //     insertNote = await Repair_Order_Note.create({
    //         writerId: data.dmeSupplierId,
    //         orderId: id,
    //         note: data.note
    //     })
    //     await RepairOrder.updateOne({ _id: id }, { $set: { notes: insertNote._id } }, { runValidators: true })
    // }
}


exports.insertRepairOrderNoteService = async (data, orderId) => {
    let insertNote = await Repair_Order_Note.create({
        writerId: data.writerId,
        orderId: orderId,
        notes: data.notes
    })
    return insertNote;
}

exports.getRepairOrderNoteByIdService = async (orderId) => {
    let notes = await Repair_Order_Note.find({ orderId: orderId })
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


exports.getRepairOrderByStatusService = async (status) => {
    const order = await RepairOrder.find({ status: status })
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


    if (order.length !== 0) {
        for (const or of order) {
            const patientDob = await Patient.find({ userId: or.patientId._id }).lean().select("dob")
            or.patientId.patientDob = await patientDob[0].dob
        }
    }

    return order
}

exports.getArchiveRepairOrderService = async (id) => {

    const order = await RepairOrder.find({ $and: [{ status: "Archived" }, { patientId: id }] })
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
        .select('-__v -updatedAt')

    if (order.length !== 0) {
        for (const or of order) {
            const patientDob = await Patient.find({ userId: or.patientId._id }).lean().select("dob")
            or.patientId.patientDob = await patientDob[0].dob
        }
    }

    return order
}