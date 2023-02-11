
const RepairOrder = require("../../model/RepairOrder.model")
const Repair_Order_Note = require("../../model/RepairOrderNote.model")


exports.createRepairOrderService = async (data) => {

    const repairOrder = await RepairOrder.create(data)
    let insertNote
    if (data.note) {
        insertNote = await Repair_Order_Note.create({
            writerId: data.dmeSupplierId,
            orderId: repairOrder._id,
            note: data.note
        })
        repairOrder.notes = insertNote._id
        repairOrder.save({ runValidators: false })
    }

    return repairOrder

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
    const repairOrder = await RepairOrder.findById(id)
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

    return repairOrder
}

exports.getRepairOrderByDmeSupplierService = async (id) => {
    const order = await RepairOrder.find({ dmeSupplierId: id })
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

    return order
}


exports.updateRepairOrderService = async (data, id) => {

    const update = await RepairOrder.updateOne({ _id: id }, { $set: data }, { runValidators: true })
    let insertNote
    if (data.note) {
        insertNote = await Repair_Order_Note.create({
            writerId: data.dmeSupplierId,
            orderId: id,
            note: data.note
        })
        await RepairOrder.updateOne({ _id: id }, { $set: { notes: insertNote._id } }, { runValidators: true })
    }
    return update
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
        .select("note")
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

    return order
}