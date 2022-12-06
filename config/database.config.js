const mongoose = require('mongoose');

const connectToMongoDb = () => {
    try {
        exports.db = mongoose.connect(process.env.MONGO_DB_CONNECTION_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(() => {
            console.log("Database connected successfully".inverse.green)
        })
    } catch (error) {
        next(`Database Connection Error -> ${error}`)
    }
}

module.exports = connectToMongoDb;