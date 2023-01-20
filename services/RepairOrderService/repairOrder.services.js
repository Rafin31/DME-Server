
const RepairOrder = require("../../model/RepairOrder.model")
const Repair_Order_Note = require("../../model/RepairOrderNote.model")


exports.createRepairOrderService = async (data) => {

    const repairOrder = await RepairOrder.create(data)
    let insertNote
    if (data.note) {
        insertNote = await Repair_Order_Note.create({
            writerId: data.creatorId,
            orderId: repairOrder._id,
            note: data.note
        })
        repairOrder.notes = insertNote._id
        repairOrder.save({ runValidators: false })
    }

    return repairOrder

}