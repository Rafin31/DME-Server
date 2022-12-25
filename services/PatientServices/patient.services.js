const Patient = require("../../model/Patient.model")

exports.getAllPatientService = async (data) => {
    const patient = Patient.find({ status: { $eq: "63861954b3b3ded1ee267309" } }) //status active
        .populate({ path: 'userId', select: "-password -updatedAt -createdAt -__v" })
        .select('-updatedAt -createdAt -__v')

    return patient
}