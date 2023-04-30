const User = require("../../model/User.model")
const service = require("../../services/UserServices/user.services")
const { generateToken } = require("../../utils/generateToken")
const crypto = require('crypto');
const XLSX = require('xlsx');
const excelToJson = require('convert-excel-to-json');
const path = require('path');


exports.getAllUser = async (req, res) => {
    try {
        const users = await service.getAllUserService()

        const exceptCategory = users.map(({ userCategory, ...other }) => other)
        const category = users.map(({ userCategory }) => userCategory)
        const status = users.map(({ status }) => status)

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

exports.getAllActiveUser = async (req, res) => {
    try {
        const users = await service.getAllActiveUserService()

        const exceptCategory = users.map(({ userCategory, ...other }) => other)
        const category = users.map(({ userCategory }) => userCategory)
        const status = users.map(({ status }) => status)

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

exports.getUserByID = async (req, res) => {
    try {
        const { id } = req.params
        const users = await service.findUserByIdService(id)

        const { userCategory, ...exceptUserCategory } = users
        const { status } = users
        const { details } = users

        const plainUserData = {
            ...exceptUserCategory,
            category: userCategory.category,
            permission: userCategory.permission,
            status: status.status,
            details
        }

        res.status(200).json({
            status: "Success",
            data: plainUserData
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

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const isDeleted = await service.deleteUserService(id);

        res.status(200).json({
            status: "Success",
            data: isDeleted
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
            sourceFile: `./public/documents/uploads/patient-import/${req.file.filename}`,
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
                I: 'weight',
                J: 'country',
                K: 'city',
                L: 'state',
                M: 'address',
                N: 'primaryInsurance',
                O: 'secondaryInsurance',
                P: "phoneNumber",
            }
        });

        const patientDob = excelData.sheet1 ?
            excelData.sheet1.map((data) => {
                const date = new Date(data.dob)
                return { ...data, dob: `${date.getMonth()}/${date.getDay()}/${date.getFullYear()}` }
            })
            :
            excelData.Sheet1.map((data) => {
                const date = new Date(data.dob)
                return { ...data, dob: `${date.getMonth()}/${date.getDay()}/${date.getFullYear()}` }
            })

        const patientData = patientDob.map((data) => (
            {
                ...data,
                userCategory: "63861b794e45673948bb7c9f", //Category Patient ID
                status: "63861954b3b3ded1ee267309" //Status Active ID

            }
        ));

        const patients = await service.importPatientService(patientData)

        res.status(200).json({
            status: "success",
            data: patients
        })
    } catch (error) {
        res.status(400).json({
            status: "failed",
            message: error?.message
            // message: error?.message?.split('User validation failed:')[1]
        })
    }
}

exports.importDoctor = async (req, res) => {
    try {
        const excelData = excelToJson({
            sourceFile: `./public/documents/uploads/doctor-import/${req.file.filename}`,
            header: {
                rows: 1
            },
            columnToKey: {
                A: 'firstName',
                B: 'lastName',
                C: 'fullName',
                D: 'title',
                E: 'email',
                F: 'password',
                G: 'userCategory',
                H: 'country',
                I: 'city',
                J: 'state',
                K: 'zip',
                L: 'npiNumber',
                M: 'companyName',
                N: 'address',
                O: 'phoneNumber',
            }
        });

        const doctorData = excelData.Sheet1 ? excelData.Sheet1.map((data) => (
            {
                ...data,
                userCategory: "638f775ea7f2be8abe01d2d4", //Category Doctor ID
                status: "63861954b3b3ded1ee267309" //Status Active ID

            }
        ))
            :
            excelData.sheet1.map((data) => (
                {
                    ...data,
                    userCategory: "638f775ea7f2be8abe01d2d4", //Category Doctor ID
                    status: "63861954b3b3ded1ee267309" //Status Active ID

                }
            ))

        const doctors = await service.importDoctorService(doctorData)

        res.status(200).json({
            status: "success",
            data: doctors
        })
    } catch (error) {
        res.status(400).json({
            status: "failed",
            message: error?.message
        })
    }
}
exports.importVeteran = async (req, res) => {
    try {

        const excelData = excelToJson({
            sourceFile: `./public/documents/uploads/veteran-import/${req.file.filename}`,
            header: {
                rows: 1
            },
            columnToKey: {
                A: 'firstName',
                B: 'lastName',
                C: 'fullName',
                D: 'lastFour',
                E: 'email',
                F: 'password',
                G: 'userCategory',
                H: 'country',
                I: 'city',
                J: 'state',
                K: 'address',
                L: 'phoneNumber',
            }
        });
        const veteranData = excelData.sheet1
            ? excelData.sheet1.map((data) => (
                {
                    ...data,
                    userCategory: "63caa0348ceb169589e611c8", //Category Veteran ID
                    status: "63861954b3b3ded1ee267309" //Status Active ID

                }
            ))
            :
            excelData.Sheet1.map((data) => (
                {
                    ...data,
                    userCategory: "63caa0348ceb169589e611c8", //Category Veteran ID
                    status: "63861954b3b3ded1ee267309" //Status Active ID

                }
            ));

        const veterans = await service.importVeteranService(veteranData)

        res.status(200).json({
            status: "success",
            data: veterans
        })
    } catch (error) {
        res.status(400).json({
            status: "failed1",
            message: error?.message
        })
    }
}


exports.exportPatient = async (req, res) => {
    try {
        const patients = await service.getAllPatientService();

        const exceptUserID = patients.map(({ userId, document, doctor, therapist, ...other }) => other)
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
        const down = './public/documents/uploads/patient-import/export-patient.xlsx'
        XLSX.utils.book_append_sheet(wb, ws, "sheet1");
        XLSX.writeFile(wb, down);


        res.download("./public/documents/uploads/patient-import/export-patient.xlsx")

    } catch (error) {

        res.status(200).json({
            status: "fail",
            data: error
        })
    }

}
exports.exportDoctor = async (req, res) => {
    try {
        const doctors = await service.getAllDoctorService();

        const exceptUserID = doctors.map(({ userId, document, patient, ...other }) => other)
        const userID = doctors.map(({ userId, ...other }) => userId)

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
        const down = './public/documents/uploads/doctor-import/export-doctor.xlsx'
        XLSX.utils.book_append_sheet(wb, ws, "sheet1");
        XLSX.writeFile(wb, down);


        res.download("./public/documents/uploads/doctor-import/export-doctor.xlsx")

    } catch (error) {

        res.status(200).json({
            status: "fail",
            data: error
        })
    }

}
exports.exportVeteran = async (req, res) => {
    try {
        const veterans = await service.getAllVeteranService();

        const exceptUserID = veterans.map(({ userId, document, assignedVaProsthetic, ...other }) => other)
        const userID = veterans.map(({ userId, ...other }) => userId)

        const veteranDataPlain = exceptUserID.map((user, index) => ({
            firstName: userID[index].firstName,
            lastName: userID[index].lastName,
            fullName: userID[index].fullName,
            email: userID[index].email,
            ...user
        }))

        const wb = XLSX.utils.book_new()
        let temp = JSON.stringify(veteranDataPlain);
        temp = JSON.parse(temp);
        const ws = XLSX.utils.json_to_sheet(temp);
        const down = './public/documents/uploads/veteran-import/export-veteran.xlsx'
        XLSX.utils.book_append_sheet(wb, ws, "sheet1");
        XLSX.writeFile(wb, down);


        res.download("./public/documents/uploads/veteran-import/export-veteran.xlsx")

    } catch (error) {

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
                message: "Email or password did not matched!"
            })
        }


        const isPasswordValid = user.comparePassword(password, user.password)

        if (!isPasswordValid) {
            return res.status(401).json({
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

        if (category === "DME-Staff") {
            const staffAdmin = await service.findUserByIdService(user._id)
            userPlainData._id = staffAdmin.details.admin[0]._id
            userPlainData.email = staffAdmin.details.admin[0].email
            userPlainData.staffId = others._id
            userPlainData.staffEmail = others.email
        }

        // res.cookie("jwtToken", token, {
        //     expires: new Date(Date.now() + 25892000000),
        //     httpOnly: true,
        //     secure: false,
        //     sameSite: "strict",
        // })


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

// Email will be sent
exports.resetPasswordRequest = async (req, res) => {
    try {
        const { email } = req.body
        const token = crypto.randomBytes(64).toString('hex')
        const date = new Date()
        const expireToken = date.setDate(date.getDate() + 1)

        const user = await service.findUserByEmailService(email)

        if (!user) {
            return res.status(400).json({
                status: "Fail",
                data: "User not found!"
            })
        }

        const insertToken = await service.updateUserService(user._id, { token, expireToken })

        const emailBody = {
            subject: "RESET YOUR PASSWORD",
            html: `<h3>You have asked to Reset Your password</h3> <p>Click bellow button to reset your password</p> 
            <a href=${req.protocol}://${req.get("host")}${req.originalUrl}/confirmation/${token}>
            <button style="background-color: #008CBA; padding: 10px 24px; border:0px; color:white; cursor:pointer" >Reset Password</button>
            </a>`
        }

        service.sendMailService(emailBody, email);

        res.status(200).json({
            status: "Success",
            data: "mail Sent"
        })
    } catch (error) {

        res.status(400).json({
            status: "Fail",
            data: error
        })
    }
}

//User clicked the reset password button on the email 
exports.resetPasswordConfirmation = async (req, res) => {
    const { token } = req.params

    const user = await service.findUserByToken(token)

    if (!user) {
        return res.status(201).json({
            status: "failed",
            message: "Invalid Request"
        })
    }
    if (new Date() > new Date(user.expireToken)) {
        return res.status(201).json({
            status: "failed",
            message: "Token Expired"
        })
    }

    user.save({ validateBeforeSave: false })

    res.writeHead(302, {
        Location: `${process.env.CLIENT_LINK}/forget-password-confirmation/${token}`
    });
    res.end();


}

//New password will be updated in database
exports.resetPasswordOperation = async (req, res) => {
    try {
        const { token, newPassword, confirmPassword } = req.body

        if (!token || !newPassword || !confirmPassword) {
            return res.status(400).json({
                status: "fail",
                data: "Missing Parameters!"
            })
        }

        const user = await service.findUserByToken(token)


        if (!user) {
            return res.status(400).json({
                status: "fail",
                data: "Invalid Token"
            })
        }

        if (new Date() > new Date(user.expireToken)) {
            return res.status(201).json({
                status: "failed",
                data: "Token Expired"
            })
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                status: "Fail",
                data: "Password did not matched!"
            })
        }


        user.token = undefined;
        user.expireToken = undefined
        user.password = newPassword;
        user.confirmPassword = confirmPassword;


        user.save({ validateModifiedOnly: true })

        return res.status(200).json({
            status: "success",
            data: "Password Changed"
        })

    } catch (error) {
        res.status(400).json({
            status: "Fail",
            data: error.message
        })
    }
}
