const Task = require("../../model/Task.model")
const Patient = require("../../model/Patient.model")
const DME_Supplier = require("../../model/DmeSupplier.model")

exports.addTaskService = async (data) => {
    const task = await Task.create(data)
    return task
}
exports.getTaskService = async () => {
    const task = await Task
        .find({})
        .populate({
            path: "patientId",
            select: "_id",
            populate: [
                {
                    path: 'userId',
                    select: '_id fullName email',
                }
            ]
        })
        .populate({
            path: "dmeSupplierId",
            select: '_id',
            populate: [
                {
                    path: 'userId',
                    select: '_id fullName email',
                }
            ]
        })

        .select("-__v -createdAt -updatedAt")
    return task
}
exports.updateTaskService = async (id, data) => {
    const task = await Task.updateOne({ _id: id }, { $set: data }, { runValidators: true })
    return task
}
exports.deleteTaskService = async (id) => {
    const task = await Task.deleteOne({ _id: id })
    return task
}
exports.getDashboardStatesService = async () => {

    try {
        const patient = await Patient.estimatedDocumentCount()
        const dme = await DME_Supplier.estimatedDocumentCount()
        return { patient, dme }
    } catch (error) {
        throw new Error(error)
    }


}

