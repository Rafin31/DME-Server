const Task = require("../../model/Task.model")
const User = require("../../model/User.model")
const Patient = require("../../model/Patient.model")
const DME_Supplier = require("../../model/DmeSupplier.model")
const Staff = require("../../model/Staff.model")
const Invited_Staff = require("../../model/InvitedStaff.model")
const Invited_VA_Prosthetics = require("../../model/InvitedVaProsthetics.model")
const VA_Prosthetics = require("../../model/VaProsthetics.model")
const Doctor = require("../../model/Doctor.model")
const Therapist = require("../../model/Therapist.model")
const EquipmentOrder = require("../../model/EquipmentOrder.model")
const RepairOrder = require("../../model/RepairOrder.model")
const VeteranOrder = require("../../model/VeteranOrder.model")
const Veteran = require("../../model/Veteran.model")
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

    if (data.inviteToken) {
        const update = await DME_Supplier.updateOne({ userId: id }, { $push: { inviteToken: data.inviteToken } })
        return update
    }

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

exports.getTaskByDmeIdService = async (id) => {
    const task = await Task
        .find({ dmeSupplierId: id })
        .populate({
            path: "patientId",
            select: "_id fullName email"

        })
        .populate({
            path: "dmeSupplierId",
            select: '_id fullName email'
        })

        .select("-__v -createdAt -updatedAt")


    if (!task) {
        return "No Task Found!"
    }


    return task
}

exports.getTaskByIdService = async (id) => {
    const task = await Task.find({ _id: id })
    return task
}

exports.deleteDocumentsService = async (doc, orderCategory, docId, body) => {

    if (doc === "order-documents") {

        const { orderId } = body
        const docDelete = await Document.deleteOne({ _id: docId })

        if (orderCategory === "equipment-order") {
            const order = await EquipmentOrder.updateOne({ _id: orderId }, { $pull: { document: docId } })
            return { docDelete, order }
        } else if (orderCategory === "repair-order") {
            const order = await RepairOrder.updateOne({ _id: orderId }, { $pull: { document: docId } })
            return { docDelete, order }
        } else if (orderCategory === "veteran-order") {
            const order = await VeteranOrder.updateOne({ _id: orderId }, { $pull: { document: docId } })
            return { docDelete, order }
        }

    }
    if (doc === "patient-document") {
        const { patientId } = body

        const docDelete = await Document.deleteOne({ _id: docId })
        const patient = await Patient.updateOne({ userId: patientId }, { $pull: { document: docId } })

        return { docDelete, patient }
    }
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

exports.getNotesByDmeAndPatientService = async (dmeId, noteFor) => {
    const notes = await Notes
        .find({ $and: [{ writerId: dmeId }, { noteFor: noteFor }] })
        .populate({
            path: "noteFor",
            select: "_id fullName email"
        })
        .populate({
            path: "writerId",
            select: "_id fullName email"
        })
        .select("-__v -updatedAt")
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
exports.uploadDocumentsService = async (fileName, path, patientId, uploaderId, title, description, orderCategory, orderId = '') => {
    const session = await db.startSession()
    try {
        session.startTransaction();
        const documentObject = {
            uploaderId: uploaderId,
            document: fileName,
            title,
            description
        }
        const document = await Document.create([documentObject], { session })

        if (path.includes("patient-documents")) {
            await Patient.updateOne({ userId: patientId }, { $push: { document: document[0]._id } }).session(session)
        }

        if (path.includes("order-documents") && orderCategory === "equipment-order") {
            await EquipmentOrder.updateOne({ _id: orderId }, { $push: { document: document[0]._id } }).session(session)
        }
        if (path.includes("order-documents") && orderCategory === "repair-order") {
            await RepairOrder.updateOne({ _id: orderId }, { $push: { document: document[0]._id } }).session(session)
        }
        if (path.includes("order-documents") && orderCategory === "veteran-order") {
            await VeteranOrder.updateOne({ _id: orderId }, { $push: { document: document[0]._id } }).session(session)
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

//dashboard
exports.getDashboardStatesService = async (userId) => {

    try {
        // const patient = await Patient.estimatedDocumentCount()
        // const doctors = await Doctor.estimatedDocumentCount()
        // const staff = await Staff.estimatedDocumentCount()
        // const therapist = await Therapist.estimatedDocumentCount()

        const equipMentOrderTotal = await EquipmentOrder.find({ $and: [{ dmeSupplierId: userId }, { status: { $ne: "Archived" } }] })
        const equipMentOrder = await EquipmentOrder.find({ $and: [{ dmeSupplierId: userId }, { status: "New-Referral" }] })

        const repairOrder = await RepairOrder.find({ $and: [{ dmeSupplierId: userId }, { status: { $ne: "Archived" } }] })
        const veteranOrder = await VeteranOrder.find({ $and: [{ dmeSupplierId: userId }, { status: { $ne: "Archived" } }] })


        const equipmentOrderNewReferralCount = equipMentOrder.length
        const equipmentOrderTotalCount = equipMentOrderTotal.length
        const repairOrderCount = repairOrder.length
        const veteranOrderCount = veteranOrder.length

        return { equipmentOrderNewReferralCount, repairOrderCount, veteranOrderCount, equipmentOrderTotalCount }

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

exports.inviteStaffService = async (data) => {

    const invited = await Invited_Staff.create(data)
    return invited

}

exports.inviteVAProstheticsService = async (data) => {

    const invited = await Invited_VA_Prosthetics.create(data)
    return invited

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


        if (!doctor.patient.includes(patientUserId) || !patient.doctor.includes(doctorUserId)) {
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


        if (!therapist.patient.includes(patientUserId) || !patient.therapist.includes(therapistUserId)) {
            therapist.patient.push(patientUserId);
            patient.therapist.push(therapistUserId);
            therapist.save({ runValidators: false })
            patient.save({ runValidators: false })
            return "Therapist successfully Assign to the patient"
        }

        throw new Error("Therapist Already assign to the patient")

    } catch (error) {
        throw new Error(error)
    }

}

exports.addVaToVeteranService = async (veteranId, vaProstheticId) => {

    try {
        const vaProsthetic = await VA_Prosthetics.findOne({ userId: vaProstheticId })
        const veteran = await Veteran.findOne({ userId: veteranId })

        if (!vaProsthetic || !veteran) {
            throw new Error("VA Prosthetic or Veteran not found")
        }


        if (!vaProsthetic?.assignedTo.includes(veteranId) || !veteran?.assignedVaProsthetic.includes(vaProstheticId)) {
            vaProsthetic.assignedTo.push(veteranId);
            veteran.assignedVaProsthetic.push(vaProstheticId);
            vaProsthetic.save({ runValidators: false })
            veteran.save({ runValidators: false })
            return "VA successfully Assign to the Veteran"
        }

        throw new Error(`VA already assigned to the Veteran`)

    } catch (error) {
        throw new Error(error)
    }

}

// remove doctor from patient 

exports.removeDoctorService = async (patientUserId, doctorUserId) => {

    try {
        const doctor = await Doctor.findOne({ userId: doctorUserId })
        const patient = await Patient.findOne({ userId: patientUserId })

        if (!doctor || !patient) {
            throw new Error("Doctor or Patient not found")
        }


        if (!doctor.patient.includes(patientUserId) || !patient.doctor.includes(doctorUserId)) {
            throw new Error("Doctor is not assigned!")
        }

        doctor.patient.pull(patientUserId)
        patient.doctor.pull(doctorUserId)
        doctor.save({ runValidators: false })
        patient.save({ runValidators: false })

    } catch (error) {
        throw new Error(error)
    }

}

exports.removeTherapistService = async (patientUserId, therapistUserId) => {

    try {
        const therapist = await Therapist.findOne({ userId: therapistUserId })
        const patient = await Patient.findOne({ userId: patientUserId })

        if (!therapist || !patient) {
            throw new Error("Therapist or Patient not found")
        }

        if (!therapist.patient.includes(patientUserId) || !patient.therapist.includes(therapistUserId)) {
            throw new Error("Therapist is not assigned!")
        }

        therapist.patient.pull(patientUserId)
        patient.therapist.pull(therapistUserId)
        therapist.save({ runValidators: false })
        patient.save({ runValidators: false })

    } catch (error) {
        throw new Error(error)
    }

}
