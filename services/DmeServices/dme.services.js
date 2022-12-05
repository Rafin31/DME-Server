const Task = require("../../model/Task.model")

exports.addTaskService = async (data) => {
    const task = await Task.create(data)
    return task
}
exports.getTaskService = async () => {
    const task = await Task
        .find({})
        .populate({
            path: "patientId",
            select: "_id",
            populate: [
                {
                    path: 'userId',
                    select: '_id fullName email',
                }
            ]
        })
        .populate({
            path: "dmeSupplierId",
            select: '_id',
            populate: [
                {
                    path: 'userId',
                    select: '_id fullName email',
                }
            ]
        })

        .select("-__v -createdAt -updatedAt")
    return task
}
exports.updateTaskService = async (id, data) => {
    const task = await Task.updateOne({ _id: id }, { $set: data }, { runValidators: true })
    return task
}
exports.deleteTaskService = async (id) => {
    const task = await Task.deleteOne({ _id: id })
    return task
}


