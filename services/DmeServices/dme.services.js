const Task = require("../../model/Task.model")
const Patient = require("../../model/Patient.model")
const DME_Supplier = require("../../model/DmeSupplier.model")
const Notes = require("../../model/Notes.model")
const Document = require("../../model/Documents.model")
const { db } = require("../../model/Task.model")
const { sendMail } = require('../../utils/sentEmail');


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
exports.uploadDocumentsService = async (fileName, path, patientId, uploaderId) => {
    const session = await db.startSession()
    try {
        session.startTransaction();
        const documentObject = {
            uploaderId: uploaderId,
            document: fileName,
        }
        const document = await Document.create([documentObject], { session })
        if (path.includes("patient-documents")) {
            await Patient.updateOne({ userId: patientId }, { $push: { document: document[0]._id } }).session(session)
        }
        await session.commitTransaction();
        return document

    } catch (error) {
        await session.abortTransaction();
        throw new Error(error)
    } finally {
        session.endSession();
    }
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


//invite Staff and doctors

exports.inviteDoctors = async (emailBody, email) => {
    try {
        const sentEmail = sendMail(emailBody, email);
        return "Mail Sent"
    } catch (error) {
        console.log(error)
        throw new Error(error)
    }
}
