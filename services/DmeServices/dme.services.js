const Task = require("../../model/Task.model")
const Patient = require("../../model/Patient.model")
const DME_Supplier = require("../../model/DmeSupplier.model")
const Notes = require("../../model/Notes.model")

exports.addTaskService = async (data) => {
    const task = await Task.create(data)
    return task
}
exports.getTaskService = async () => {
    const task = await Task
        .find({})
        .populate({
            path: "patientId",
            select: "_id fullName email"

        })
        .populate({
            path: "dmeSupplierId",
            select: '_id fullName email'
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

//notes
exports.addNotesService = async (data) => {
    const task = await Notes.create(data)
    return task
}
exports.getNotesService = async () => {
    const notes = await Notes
        .find({})
        .populate({
            path: "patientId",
            select: "_id fullName email"
        })
        .populate({
            path: "writerId",
            select: "_id fullName email"
        })
        .select("-__v -createdAt -updatedAt")
    return notes
}
exports.updateNotesService = async (id, data) => {
    const notes = await Notes.updateOne({ _id: id }, { $set: data }, { runValidators: true })
    return notes
}
exports.deleteNotesService = async (id) => {
    const notes = await Notes.deleteOne({ _id: id })
    return notes
}

//upload document
exports.uploadDocumentsService = async (data) => {

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

