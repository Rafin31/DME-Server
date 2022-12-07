const Task = require("../../model/Task.model")
const User = require("../../model/User.model")
const Patient = require("../../model/Patient.model")
const DME_Supplier = require("../../model/DmeSupplier.model")
const Doctor = require("../../model/Doctor.model")
const Therapist = require("../../model/Therapist.model")
const Notes = require("../../model/Notes.model")
const Document = require("../../model/Documents.model")
const { db } = require("../../model/Task.model")
const { sendMail } = require('../../utils/sentEmail');


exports.findDmeByEmail = async (email) => {
    let user = await User.findOne({ email: email })
        .lean()
        .populate({ path: 'status', select: ' -updatedAt -createdAt -__v' })
        .populate({ path: 'userCategory', select: '-updatedAt -createdAt -__v' })
        .select('-password -updatedAt -createdAt -__v');

    if (!user) {
        throw new Error("User not found!")
    }

    if (user.userCategory.category !== "DME-Supplier") {
        throw new Error("User not DME Supplier!")
    }

    const details = await DME_Supplier.findOne({ userId: user._id }).select('-_id -userId -updatedAt -createdAt -__v')
    user = { ...user, details }

    return user
}

exports.updateDmeService = async (id, data) => {
    const update = await DME_Supplier.updateOne({ userId: id }, data)
    return update
}

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

exports.inviteEmail = async (emailBody, email) => {
    try {
        const sentEmail = sendMail(emailBody, email);
        return "Mail Sent"
    } catch (error) {
        throw new Error(error)
    }
}

exports.uploadBannerService = async (id, data) => {
    const uploaded = await DME_Supplier.updateOne({ userId: id }, { $set: data })
    return uploaded
}
exports.getBannerService = async (id) => {
    const banner = await DME_Supplier.findOne({ userId: id }).select('banner')
    return banner
}

// add patient to doctor

exports.addPatientToDoctorService = async (patientUserId, doctorUserId) => {

    try {
        const doctor = await Doctor.findOne({ userId: doctorUserId })
        const patient = await Patient.findOne({ userId: patientUserId })

        if (!doctor || !patient) {
            throw new Error("Doctor or Patient not found")
        }


        if (!doctor.patient.includes(patientUserId) || !patient.doctor.push(doctorUserId)) {
            doctor.patient.push(patientUserId);
            patient.doctor.push(doctorUserId);
            doctor.save({ runValidators: false })
            patient.save({ runValidators: false })
            return "Doctor successfully Assign to the patient"
        }

        throw new Error("Doctor Already assign to the patient")

    } catch (error) {
        throw new Error(error)
    }

}
exports.addPatientToTherapistService = async (patientUserId, therapistUserId) => {

    try {
        const therapist = await Therapist.findOne({ userId: therapistUserId })
        const patient = await Patient.findOne({ userId: patientUserId })

        if (!therapist || !patient) {
            throw new Error("Therapist or Patient not found")
        }


        if (!therapist.patient.includes(patientUserId) || !patient.therapist.push(therapistUserId)) {
            therapist.patient.push(patientUserId);
            patient.therapist.push(therapistUserId);
            therapist.save({ runValidators: false })
            patient.save({ runValidators: false })
            return "Therapist successfully Assign to the patient"
        }

        throw new Error("Doctor Already assign to the patient")

    } catch (error) {
        throw new Error(error)
    }

}