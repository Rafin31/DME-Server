const User = require("../../model/User.model")
const service = require("../../services/UserServices/user.services")
const { generateToken } = require("../../utils/generateToken")
const fs = require('fs');
const XLSX = require('xlsx');
const excelToJson = require('convert-excel-to-json');
const path = require('path');


exports.getAllUserService = async (req, res) => {
    try {
        const users = await service.getAllUserService()

        const exceptCategory = users.map(({ userCategory, ...other }) => other)
        const category = users.map(({ userCategory, ...other }) => userCategory)
        const status = users.map(({ status, ...other }) => status)

        const userDataPlain = exceptCategory.map((user, index) => ({
            ...user,
            category: category[index].category,
            permission: category[index].permission,
            status: status[index].status
        }))



        res.status(200).json({
            status: "Success",
            data: userDataPlain
        })
    } catch (error) {
        res.status(400).json({
            status: "failed",
            message: error.message
        })
    }
}

exports.createUser = async (req, res) => {
    try {
        const user = await service.createUserService(req.body)
        res.status(200).json({
            status: "Success",
            data: user
        })
    } catch (error) {
        res.status(400).json({
            status: "failed",
            message: error.message
        })
    }
}

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params
        const user = await service.updateUserService(id, req.body)

        res.status(200).json({
            status: "Success",
            data: user
        })
    } catch (error) {
        res.status(400).json({
            status: "failed",
            message: error.message
        })
    }
}

exports.importPatient = async (req, res) => {
    try {
        const excelData = excelToJson({
            sourceFile: `./public/documents/uploads/patient/${req.file.filename}`,
            header: {
                rows: 1
            },
            columnToKey: {
                A: 'firstName',
                B: 'lastName',
                C: 'fullName',
                D: 'email',
                E: 'password',
                F: 'userCategory',
                G: 'gender',
                H: 'dob',
                I: 'age',
                J: 'weight',
                K: 'country',
                L: 'city',
                M: 'state',
                N: 'address',
                O: 'primaryInsurance',
                P: "secondaryInsurance",
                Q: "phoneNumber",
            }
        });

        const patientData = excelData.Sheet1.map((data) => ({
            ...data,
            userCategory: "63861b794e45673948bb7c9f", //Category Patient ID
            status: "63861954b3b3ded1ee267309" //Status Active ID

        }));


        const patients = await service.importPatientService(patientData)

        res.status(200).json({
            status: "success",
            data: patients
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            status: "failed",
            message: error?.message
            // message: error?.message?.split('User validation failed:')[1]
        })
    }
}

exports.exportPatient = async (req, res) => {
    try {
        const patients = await service.getAllPatientService();

        const exceptUserID = patients.map(({ userId, ...other }) => other)
        const userID = patients.map(({ userId, ...other }) => userId)

        const patientDataPlain = exceptUserID.map((user, index) => ({
            firstName: userID[index].firstName,
            lastName: userID[index].lastName,
            fullName: userID[index].fullName,
            email: userID[index].email,
            ...user
        }))

        const wb = XLSX.utils.book_new()
        let temp = JSON.stringify(patientDataPlain);
        temp = JSON.parse(temp);
        const ws = XLSX.utils.json_to_sheet(temp);
        const down = './public/documents/uploads/patient/export-patient.xlsx'
        XLSX.utils.book_append_sheet(wb, ws, "sheet1");
        XLSX.writeFile(wb, down);


        res.download("./public/documents/uploads/patient/export-patient.xlsx")

    } catch (error) {
        console.log(error)
        res.status(200).json({
            status: "fail",
            data: error
        })
    }

}

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                status: "failed",
                message: "Give Email and Password!"
            })
        }

        const user = await service.findUserByEmailService(email)

        if (!user) {
            return res.status(401).json({
                status: "failed",
                message: "User not found! Please create account"
            })
        }


        const isPasswordValid = user.comparePassword(password, user.password)

        if (!isPasswordValid) {
            return res.status(403).json({
                status: "failed",
                message: "Email or password did not matched!"
            })
        }

        const userStatus = await service.findUserStatusService(email);

        if (userStatus !== "Active") {
            return res.status(403).json({
                status: "failed",
                message: "Account is not active. Please contact with admin!"
            })
        }

        const userCategory = await service.findUserCategoryService(email);

        const token = generateToken({ email: email, categoryId: userCategory._id, status: userStatus })

        const { category, permission } = userCategory.toObject()
        const { password: pwd, status, userCategory: ucg, updatedAt, createdAt, __v, ...others } = user.toObject()

        const userPlainData = {
            ...others,
            category: category,
            permission: permission,
            token: token,
        }

        res.status(200).json({
            status: "Success",
            data: userPlainData,
        })



    } catch (error) {
        res.status(400).json({
            status: "failed",
            message: error.message
        })
    }

}
exports.status = async (req, res) => {
    try {
        const status = await service.createStatusService(req.body)
        res.status(200).json({
            status: "Success",
            data: status
        })
    } catch (error) {
        res.status(400).json({
            status: "failed",
            message: error.message
        })
    }
}
exports.category = async (req, res) => {
    try {
        const category = await service.createCategoryService(req.body)
        res.status(200).json({
            status: "Success",
            data: category
        })
    } catch (error) {
        res.status(400).json({
            status: "failed",
            message: error.message
        })
    }
}
