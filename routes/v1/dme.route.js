const express = require('express');
const router = express.Router()
const dmeController = require('../../controllers/DmeController/dme.controller')
const uploadDocument = require('../../middlewares/importDocument')

// api/v1/dme
router.route('/task')
    .post(dmeController.addTask)
    .get(dmeController.getTask)

router.route('/notes')
    .post(dmeController.addNotes)
    .get(dmeController.getNotes)

router.get('/dashboardStates', dmeController.getDashboardStates)


router.get("/get-document", dmeController.getDocuments)


router.post('/invite-doctor', dmeController.inviteDoctor)
router.post('/invite-therapist', dmeController.inviteTherapist)
router.post('/invite-staff', dmeController.inviteStaff)


router.post('/upload-order-document', uploadDocument("order-documents").single("order-document"), dmeController.uploadDocuments)
router.post('/upload-patient-document/:id', uploadDocument("patient-documents").single("patient-document"), dmeController.uploadDocuments)


router.route("/banner/:id")
    .post(dmeController.uploadBanner)
    .get(dmeController.getBanner)



router.route('/task/:id')
    .patch(dmeController.updateTask)
    .delete(dmeController.deleteTask)


router.route('/notes/:id')
    .patch(dmeController.updateNotes)
    .delete(dmeController.deleteNotes)


module.exports = router