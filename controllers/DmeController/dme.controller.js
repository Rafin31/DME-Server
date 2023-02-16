const dmeService = require('../../services/DmeServices/dme.services')

const crypto = require('crypto');
const { generateToken } = require('../../utils/generateInviteToken');
const multer = require('multer');

exports.addTask = async (req, res) => {
    try {
        const task = await dmeService.addTaskService(req.body)
        return res.status(200).json({
            status: 'success',
            data: task
        })
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            data: error
        })
    }
}

exports.getTask = async (req, res) => {
    try {
        const task = await dmeService.getTaskService()
        return res.status(200).json({
            status: 'success',
            data: task
        })
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            data: error
        })
    }
}

exports.getTaskByDmeId = async (req, res) => {
    try {
        const { id } = req.params
        const task = await dmeService.getTaskByDmeIdService(id)
        return res.status(200).json({
            status: 'success',
            data: task
        })
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            data: error.message
        })
    }
}

exports.getTaskById = async (req, res) => {
    try {
        const { id } = req.params
        const task = await dmeService.getTaskByIdService(id)
        return res.status(200).json({
            status: 'success',
            data: task
        })
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            data: error.message
        })
    }
}

exports.updateTask = async (req, res) => {
    try {
        const { id } = req.params
        const task = await dmeService.updateTaskService(id, req.body)

        if (task.modifiedCount === 0) {
            return res.status(400).json({
                status: 'fail',
                data: "Task not found!"
            })
        }

        return res.status(200).json({
            status: 'success',
            data: "Updated"
        })
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            data: error
        })
    }
}
exports.deleteTask = async (req, res) => {
    try {
        const { id } = req.params
        const task = await dmeService.deleteTaskService(id)

        if (task.deletedCount === 0) {
            return res.status(400).json({
                status: 'fail',
                data: "Task not found!"
            })
        }

        return res.status(200).json({
            status: 'success',
            data: task
        })
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            data: error
        })
    }
}

// notes

exports.addNotes = async (req, res) => {
    try {
        const notes = await dmeService.addNotesService(req.body)
        return res.status(200).json({
            status: 'success',
            data: notes
        })
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            data: error
        })
    }
}

exports.getNotes = async (req, res) => {
    try {
        const notes = await dmeService.getNotesService()
        return res.status(200).json({
            status: 'success',
            data: notes
        })
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            data: error
        })
    }
}

exports.getNotesByDmeAndPatient = async (req, res) => {
    try {
        const { writerId, patientId } = req.query
        const notes = await dmeService.getNotesByDmeAndPatientService(writerId, patientId)


        if (!notes) {
            return res.status(200).json({
                status: 'success',
                data: []
            })
        }

        return res.status(200).json({
            status: 'success',
            data: notes
        })
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            data: error
        })
    }
}

exports.updateNotes = async (req, res) => {
    try {
        const { id } = req.params
        const notes = await dmeService.updateNotesService(id, req.body)

        if (notes.modifiedCount === 0) {
            return res.status(400).json({
                status: 'fail',
                data: "Notes not found!"
            })
        }

        return res.status(200).json({
            status: 'success',
            data: "Updated"
        })
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            data: error
        })
    }
}

exports.deleteNotes = async (req, res) => {
    try {
        const { id } = req.params
        const notes = await dmeService.deleteNotesService(id)

        if (notes.deletedCount === 0) {
            return res.status(400).json({
                status: 'fail',
                data: "Task not found!"
            })
        }

        return res.status(200).json({
            status: 'success',
            data: notes
        })
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            data: error
        })
    }
}

//upload document 

exports.uploadDocuments = async (req, res) => {

    try {
        const documentFileName = req.file.filename
        const path = req.file.destination
        const { uploaderId, title, description, orderCategory } = req.body
        const { id: patientId } = req.params
        const fileName = path.split('uploads/')[1] + "/" + documentFileName
        const orderId = req.body.orderId || ""

        await dmeService.uploadDocumentsService(fileName, path, patientId, uploaderId, title, description, orderCategory, orderId)

        return res.status(200).json({
            status: "Success",
            data: "uploaded"
        })
    } catch (error) {
        return res.status(400).json({
            status: "Fail",
            data: error
        })
    }

}

exports.getDocuments = async (req, res) => {
    try {

        const { document } = req.query;
        return res.download(`./public/documents/uploads/${document}`)

    } catch (error) {
        return res.status(400).json({
            status: "fail",
            message: error.message
        })
    }
}

exports.deleteDocuments = async (req, res) => {
    try {

        const { document, orderCategory } = req.query
        const { id: docId } = req.params

        const deleteDoc = await dmeService.deleteDocumentsService(document, orderCategory, docId, req.body)

        return res.status(200).json({
            status: "success",
            message: deleteDoc
        })

    } catch (error) {
        return res.status(400).json({
            status: "fail",
            message: error.message
        })
    }
}

//dashboard
exports.getDashboardStates = async (req, res) => {
    try {

        const { id } = req.params

        const states = await dmeService.getDashboardStatesService(id)

        res.status(200).json({
            status: "success",
            message: states
        })

    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error
        })
    }
}


//invite staffs and doctors

exports.inviteDoctor = async (req, res) => {

    try {
        const { email } = req.body
        const emailBody = {
            subject: "Invitation from dmedocrx",
            html: `<h3>You are invited to create an account on dmedocrx</h3> <p>Click bellow button to create Your Account</p> 
        <a href=${process.env.CLIENT_LINK}/signup>
        <button style="background-color: #008CBA; padding: 10px 24px; border:0px; color:white; cursor:pointer" >Create Account</button>
        </a>`
        }

        const invite = await dmeService.inviteEmail(emailBody, email)

        return res.status(200).json({
            status: "success",
            data: invite
        })

    } catch (error) {
        return res.status(200).json({
            status: "success",
            data: error
        })
    }
}

exports.inviteTherapist = async (req, res) => {

    try {
        const { email } = req.body
        const emailBody = {
            subject: "Invitation from dmedocrx",
            html: `<h3>You are invited to create an account on dmedocrx</h3> <p>Click bellow button to create Your Account</p> 
        <a href=${process.env.CLIENT_LINK}/signup>
        <button style="background-color: #008CBA; padding: 10px 24px; border:0px; color:white; cursor:pointer" >Create Account</button>
        </a>`
        }

        const invite = await dmeService.inviteEmail(emailBody, email)

        return res.status(200).json({
            status: "success",
            data: invite
        })

    } catch (error) {
        return res.status(200).json({
            status: "success",
            data: error
        })
    }
}


exports.inviteStaff = async (req, res) => {
    try {
        const { dmeSupplierEmail } = req.body
        const { staffEmail } = req.body

        const jwtPlayLoad = {
            dmeSupplierEmail,
            invitedEmail: staffEmail,
            invitationFor: "Staff"
        }

        const token = generateToken(jwtPlayLoad)


        const dme = await dmeService.findDmeByEmail(dmeSupplierEmail);

        const invitedData = {
            email: staffEmail,
            admin: dme?._id,
            inviteToken: token
        }
        const invited = await dmeService.inviteStaffService(invitedData)



        if (!invited || !dme) {
            return res.status(400).json({
                status: "fail",
                message: "Something went Wrong!"
            })
        }

        await dmeService.updateDmeService(dme._id, { inviteToken: token })


        const emailBody = {
            subject: "Invitation from dmedocrx",
            html: `<h3>You are invited to create an account on dmedocrx</h3> <p>Click bellow button to create Your Account</p> 
        <a href=${process.env.CLIENT_LINK}/signup?invitationToken=${token}>
        <button style="background-color: #008CBA; padding: 10px 24px; border:0px; color:white; cursor:pointer" >Create Account</button>
        </a>`
        }
        const invite = await dmeService.inviteEmail(emailBody, staffEmail)

        return res.status(200).json({
            status: "success",
            data: invite
        })
    } catch (error) {
        return res.status(400).json({
            status: "fail",
            data: error.message
        })
    }

}

exports.inviteVaProsthetics = async (req, res) => {
    try {
        const { dmeSupplierEmail } = req.body
        const { vaProstheticsEmail } = req.body


        const dme = await dmeService.findDmeByEmail(dmeSupplierEmail);

        const jwtPlayLoad = {
            dmeSupplierEmail,
            invitedEmail: vaProstheticsEmail,
            invitationFor: "va-prosthetics"
        }

        const token = generateToken(jwtPlayLoad)

        const invitedData = {
            email: vaProstheticsEmail,
            admin: dme?._id,
            inviteToken: token
        }



        const invited = await dmeService.inviteVAProstheticsService(invitedData)

        if (!invited || !dme) {
            return res.status(400).json({
                status: "fail",
                message: "Something went Wrong!"
            })
        }

        await dmeService.updateDmeService(dme._id, { inviteToken: token })


        const emailBody = {
            subject: "Invitation from dmedocrx",
            html: `<h3>You are invited to create an account on dmedocrx</h3> <p>Click bellow button to create Your Account</p> 
        <a href=${process.env.CLIENT_LINK}/signup?invitationToken=${token}>
        <button style="background-color: #008CBA; padding: 10px 24px; border:0px; color:white; cursor:pointer" >Create Account</button>
        </a>`
        }
        const invite = await dmeService.inviteEmail(emailBody, vaProstheticsEmail)

        return res.status(200).json({
            status: "success",
            data: invite
        })
    } catch (error) {
        return res.status(400).json({
            status: "fail",
            data: error.message
        })
    }

}

//add patient to doctor

exports.addPatientToDoctor = async (req, res) => {
    try {
        const { patientUserId } = req.body
        const { doctorUserId } = req.body

        const added = await dmeService.addPatientToDoctorService(patientUserId, doctorUserId)

        return res.status(200).json({
            status: "success",
            data: added
        })

    } catch (error) {
        return res.status(400).json({
            status: "fail",
            data: error.message
        })
    }
}
exports.addPatientToTherapist = async (req, res) => {
    try {
        const { patientUserId } = req.body
        const { therapistUserId } = req.body

        const added = await dmeService.addPatientToTherapistService(patientUserId, therapistUserId)

        return res.status(200).json({
            status: "success",
            data: added
        })

    } catch (error) {
        return res.status(400).json({
            status: "fail",
            data: error.message
        })
    }
}
exports.addVaToVeteran = async (req, res) => {
    try {
        const { veteranId } = req.body
        const { vaProstheticId } = req.body

        const added = await dmeService.addVaToVeteranService(veteranId, vaProstheticId)

        return res.status(200).json({
            status: "success",
            data: added
        })

    } catch (error) {
        return res.status(400).json({
            status: "fail",
            data: error.message
        })
    }
}

// Banner
exports.uploadBanner = async (req, res) => {
    try {

        const bannerFileName = req.file.filename
        const path = req.file.destination
        const { id } = req.params
        const fileName = path.split('uploads/')[1] + "/" + bannerFileName

        const bannerUploaded = await dmeService.uploadBannerService(id, { banner: fileName })

        return res.status(200).json({
            status: "success",
            data: bannerUploaded
        })
    } catch (error) {
        return res.status(400).json({
            status: "fail",
            data: error.message
        })
    }
}
exports.getBanner = async (req, res) => {
    try {
        const { id } = req.params
        const banner = await dmeService.getBannerService(id)
        return res.status(200).json({
            status: "success",
            data: banner
        })
    } catch (error) {
        return res.status(400).json({
            status: "fail",
            data: error.message
        })
    }
}