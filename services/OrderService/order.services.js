const Order = require("../../model/Order.model")

exports.createOrderService = async (data) => {
    const order = await Order.create(data)
    return order
}
exports.getAllOrderService = async () => {
    const orders = await Order.find({})
        .lean()
        .populate({ path: "dmeSupplierId", select: "_id fullName email" })
        .populate({ path: "patientId", select: "_id fullName email" })
        .select('-__v -createdAt -updatedAt')

    return orders
}
exports.getOrderByIdService = async (id) => {
    const order = await Order.findById(id)
        .lean()
        .populate({ path: "dmeSupplierId", select: "-password -updatedAt -__v" })
        .populate({ path: "patientId", select: "-password -updatedAt -__v" })
        .select('-__v -createdAt -updatedAt')

    return order
}
exports.getOrderByDmeSupplierService = async (id) => {
    const order = await Order.find({ dmeSupplierId: id })
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
    const update = Order.updateOne({ _id: id }, { $set: data }, { runValidators: true })
    return update
}