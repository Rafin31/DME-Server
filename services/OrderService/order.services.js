const Order = require("../../model/Order.model")
const Order_Note = require("../../model/OrderNote")

exports.createOrderService = async (data) => {
    const order = await Order.create(data)
    let insertNote
    if (data.note) {
        insertNote = await Order_Note.create({
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
    const orders = await Order.find({})
        .lean()
        .populate({ path: "dmeSupplierId", select: "_id fullName email" })
        .populate({ path: "patientId", select: "_id fullName email" })
        .populate({ path: "notes" })
        .select('-__v -createdAt -updatedAt')

    return orders
}

exports.getOrderByIdService = async (id) => {
    const order = await Order.findById(id)
        .lean()
        .populate({ path: "dmeSupplierId", select: "-password -updatedAt -__v" })
        .populate({ path: "patientId", select: "-password -updatedAt -__v" })
        .populate({ path: "notes", select: "-updatedAt -__v" })
        .populate({ path: "document", select: "-updatedAt -__v" })
        .select('-__v -createdAt -updatedAt')

    return order
}

exports.getOrderByDmeSupplierService = async (id) => {
    const order = await Order.find({ dmeSupplierId: id })
        .lean()
        .populate({ path: "dmeSupplierId", select: "_id fullName email" })
        .populate({ path: "patientId", select: "_id fullName email" })
        .populate({ path: "notes", select: "-updatedAt -__v" })
        .select('-__v -createdAt -updatedAt')

    return order
}
exports.getOrderByPatientService = async (id) => {
    const order = await Order.find({ patientId: id })
        .lean()
        .populate({ path: "dmeSupplierId", select: "_id fullName email" })
        .populate({ path: "patientId", select: "_id fullName email" })
        .select('-__v -createdAt -updatedAt')

    return order
}
exports.getOrderByStatusService = async (status) => {
    const order = await Order.find({ status: status })
        .lean()
        .populate({ path: "dmeSupplierId", select: "_id fullName email" })
        .populate({ path: "patientId", select: "_id fullName email" })
        .select('-__v -createdAt -updatedAt')

    return order
}

exports.updateOrderService = async (data, id) => {

    const update = await Order.updateOne({ _id: id }, { $set: data }, { runValidators: true })
    let insertNote
    if (data.note) {
        insertNote = await Order_Note.create({
            writerId: data.dmeSupplierId,
            orderId: id,
            note: data.note
        })
        await Order.updateOne({ _id: id }, { $set: { notes: insertNote._id } }, { runValidators: true })
    }
    return update
}

//motes
exports.insertOrderNoteService = async (data, orderId) => {
    let insertNote = await Order_Note.create({
        writerId: data.writerId,
        orderId: orderId,
        note: data.note
    })

    const updateOrder = await Order.updateOne({ _id: orderId }, { $set: { notes: insertNote._id } }, { runValidators: true })
    return { updateOrder, insertNote }
}


exports.getNotesByOrderIdService = async (orderId) => {
    let notes = await Order_Note.find({ orderId: orderId })
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
