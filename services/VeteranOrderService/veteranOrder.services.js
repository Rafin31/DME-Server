const VeteranOrder = require("../../model/VeteranOrder.model")
const Veteran_Order_Note = require("../../model/VeteranOrderNote.model")


exports.createVeteranOrderService = async (data) => {

    const veteranOrder = await VeteranOrder.create(data)
    let insertNote
    if (data.note) {
        insertNote = await Veteran_Order_Note.create({
            writerId: data.creatorId,
            orderId: veteranOrder._id,
            note: data.note
        })
        veteranOrder.notes = insertNote._id
        veteranOrder.save({ runValidators: false })
    }

    return veteranOrder

}