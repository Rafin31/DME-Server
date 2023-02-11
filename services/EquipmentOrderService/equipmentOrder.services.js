const EquipmentOrder = require("../../model/EquipmentOrder.model")
const Equipment_Order_Note = require("../../model/EquipmentOrderNote.model")

exports.createOrderService = async (data) => {
    const order = await EquipmentOrder.create(data)
    let insertNote
    if (data.note) {
        insertNote = await Equipment_Order_Note.create({
            writerId: data.dmeSupplierId,
            orderId: order._id,
            note: data.note
        })
        order.notes = insertNote._id
        order.save({ runValidators: false })
    }

    return order
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
    const order = await EquipmentOrder.find({ dmeSupplierId: id })
        .lean()
        .populate({ path: "dmeSupplierId", select: "_id fullName email" })
        .populate({ path: "patientId", select: "_id fullName email" })
        .populate({ path: "notes", select: "-updatedAt -__v" })
        .select('-__v -updatedAt')

    return order
}
exports.getOrderByPatientService = async (id) => {
    const order = await EquipmentOrder.find({ patientId: id })
        .lean()
        .populate({ path: "dmeSupplierId", select: "_id fullName email" })
        .populate({ path: "patientId", select: "_id fullName email" })
        .select('-__v -createdAt -updatedAt')

    return order
}
exports.getOrderByStatusService = async (status) => {
    const order = await EquipmentOrder.find({ status: status })
        .lean()
        .populate({ path: "dmeSupplierId", select: "_id fullName email" })
        .populate({ path: "patientId", select: "_id fullName email" })
        .select('-__v -updatedAt')

    return order
}

exports.updateOrderService = async (data, id) => {

    const update = await EquipmentOrder.updateOne({ _id: id }, { $set: data }, { runValidators: true })
    let insertNote
    if (data.note) {
        insertNote = await Equipment_Order_Note.create({
            writerId: data.dmeSupplierId,
            orderId: id,
            note: data.note
        })
        await EquipmentOrder.updateOne({ _id: id }, { $set: { notes: insertNote._id } }, { runValidators: true })
    }
    return update
}

//notes
exports.insertOrderNoteService = async (data, orderId) => {
    let insertNote = await Equipment_Order_Note.create({
        writerId: data.writerId,
        orderId: orderId,
        note: data.note
    })

    const updateOrder = await EquipmentOrder.updateOne({ _id: orderId }, { $set: { notes: insertNote._id } }, { runValidators: true })
    return { updateOrder, insertNote }
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
        .select("note")
    return notes
}
