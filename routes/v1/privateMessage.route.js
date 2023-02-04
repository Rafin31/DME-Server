const express = require('express');
const router = express.Router()
const privateMessageController = require('../../controllers/PrivateMessage/privateMessage.controller')


// api/v1/private-message

router.route("/")
    .post(privateMessageController.insertMessage)

router.route("/receiver/:id")
    .get(privateMessageController.getMessageByReceiver)

router.route("/sender/:id")
    .get(privateMessageController.getMessageBySender)

router.route("/:id")
    .delete(privateMessageController.deleteMessage)


module.exports = router


