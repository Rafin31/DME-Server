const service = require('../../services/DmeServices/dme.services')
const crypto = require('crypto');

exports.addTask = async (req, res) => {
    try {
        const task = await service.addTaskService(req.body)
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
        const task = await service.getTaskService()
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
        const task = await service.getTaskByDmeIdService(id)
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
        const task = await service.getTaskByIdService(id)
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
        const task = await service.updateTaskService(id, req.body)

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
        const task = await service.deleteTaskService(id)

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
        const notes = await service.addNotesService(req.body)
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
        const notes = await service.getNotesService()
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
        const notes = await service.updateNotesService(id, req.body)

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
        const notes = await service.deleteNotesService(id)

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
        const { uploaderId } = req.body
        const { id: patientId } = req.params
        const fileName = path.split('uploads/')[1] + "/" + documentFileName
        const orderId = req.body.orderId || ""

        await service.uploadDocumentsService(fileName, path, patientId, uploaderId, orderId)

        return res.status(200).json({
            status: "Success",
            data: "uploaded"
        })
    } catch (error) {
        console.log(error);
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

        const { document } = req.query
        const { id: docId } = req.params
        const { orderId } = req.body
        const deleteDoc = await service.deleteDocumentsService(document, docId, orderId)

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

        const states = await service.getDashboardStatesService(id)

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

        const invite = await service.inviteEmail(emailBody, email)

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

        const invite = await service.inviteEmail(emailBody, email)

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
        const token = crypto.randomBytes(64).toString('hex')
        //inviteToken

        const dme = await service.findDmeByEmail(dmeSupplierEmail);


        await service.updateDmeService(dme._id, { inviteToken: token })


        const emailBody = {
            subject: "Invitation from dmedocrx",
            html: `<h3>You are invited to create an account on dmedocrx</h3> <p>Click bellow button to create Your Account</p> 
        <a href=${process.env.CLIENT_LINK}/signup?invitationToken=${token}>
        <button style="background-color: #008CBA; padding: 10px 24px; border:0px; color:white; cursor:pointer" >Create Account</button>
        </a>`
        }
        const invite = await service.inviteEmail(emailBody, staffEmail)

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

        const added = await service.addPatientToDoctorService(patientUserId, doctorUserId)

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

        const added = await service.addPatientToTherapistService(patientUserId, therapistUserId)

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
        const { id } = req.params
        const { imgUrl } = req.body
        const uploaded = await service.uploadBannerService(id, { banner: imgUrl })
        return res.status(200).json({
            status: "success",
            data: uploaded
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
        const banner = await service.getBannerService(id)
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