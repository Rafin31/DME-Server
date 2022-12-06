const multer = require('multer');
const path = require('path');

const uploadDocument = (folderName) => {

    const storage = multer.diskStorage({
        destination: `./public/documents/uploads/${folderName}`,
        filename: (req, file, cb) => {
            const uniqueFilename = Date.now() + '__' + Math.round(Math.random() * 1E9)
            cb(null, uniqueFilename + "-" + file.originalname)
        }
    })

    const uploader = multer({
        storage,
        fileFilter: (req, file, cb) => {
            let supportedFile
            if (folderName === "patient-import") {
                supportedFile = /.xlsx/
            } else {
                supportedFile = /.xlsx|.pdf|.doc|.jpg|.jpeg|.png/
            }

            const fileExtension = path.extname(file.originalname)
            if (supportedFile.test(fileExtension)) {
                cb(null, true)
            } else {
                cb(`Must be a ${supportedFile.toString().replaceAll('|', " ").replaceAll('/', "").replaceAll('.', "")} type file`, false)
            }
        },
        limits: {
            fileSize: 5000000
        },
    })

    return uploader
}

module.exports = uploadDocument;