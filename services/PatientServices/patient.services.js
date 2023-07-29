const Patient = require("../../model/Patient.model")
const Notes = require("../../model/Notes.model")
const Document = require("../../model/Documents.model")
const User = require("../../model/User.model")

exports.getAllPatientService = async () => {
    const patient = Patient.find({ status: { $eq: "63861954b3b3ded1ee267309" } }) //status active
        .populate({ path: 'userId', select: "-password -updatedAt -createdAt -__v" })
        .populate({ path: 'doctor', select: "fullName email" })
        .populate({ path: 'therapist', select: "fullName email" })
        .select('-updatedAt -createdAt -__v')

    return patient
}

exports.getAllPatientByDMEService = async (dmeSupplier) => {

    const patient = Patient.find({
        $and: [
            { status: { $eq: "63861954b3b3ded1ee267309" } },//status active
            { dmeSupplier: dmeSupplier }
        ]
    })
        .populate({ path: 'userId', select: "-password -updatedAt -createdAt -__v" })
        .populate({ path: 'doctor', select: "fullName email" })
        .populate({ path: 'therapist', select: "fullName email" })
        .populate({ path: 'dmeSupplier', select: "fullName email" })
        .select('-updatedAt -createdAt -__v')

    return patient
}

exports.deletePatientByIDService = async (id) => {
    const deletedNotes = await Notes.deleteMany({ noteFor: id })
    const patient = await Patient.findOne({ userId: id })
    const patientDocuments = patient.document

    for (const id of patientDocuments) {
        await Document.findByIdAndDelete(id)
    }


    const deletedPatient = await Patient.deleteOne({ userId: id })
    const deletedUser = await User.deleteOne({ _id: id })

    return { deletedPatient, deletedUser }
}