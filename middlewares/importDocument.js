const multer = require('multer');
const path = require('path');

const uploadDocument = (folderName) => {

    const storage = multer.diskStorage({
        destination: `./public/documents/uploads/${folderName}`,
        filename: (req, file, cb) => {
            const uniqueFilename = Date.now() + '-' + Math.round(Math.random() * 1E9)
            cb(null, uniqueFilename + "-" + file.originalname)
        }
    })

    const uploader = multer({
        storage,
        fileFilter: (req, file, cb) => {
            const supportedFile = /.xlsx/
            const fileExtension = path.extname(file.originalname)
            if (supportedFile.test(fileExtension)) {
                cb(null, true)
            } else {
                cb("Must be a .xlsx type file", false)
            }
        },
        limits: {
            fileSize: 5000000
        },
    })

    return uploader
}

module.exports = uploadDocument;