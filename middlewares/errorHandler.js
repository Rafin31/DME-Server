const multer = require("multer");

const errorHandler = (err, req, res, next) => {

    if (err) {
        if (err instanceof multer.MulterError) { // handle multer Error
            res.status(400).json({ message: err.message });
        } else if (err) {
            res.status(400).json({ message: err.message });
        }
    }

}

module.exports = errorHandler;