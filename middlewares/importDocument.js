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
            if (folderName === "patient-import" || folderName === "doctor-import" || folderName === "veteran-import") {
                supportedFile = /.xlsx/
            } else if (folderName === "dme-banner") {
                supportedFile = /.jpg|.jpeg|.png/
            } else {
                supportedFile = /.xlsx|.pdf|.doc|.jpg|.jpeg|.png|.txt/
            }

            const fileExtension = path.extname(file.originalname)
            if (supportedFile.test(fileExtension.toLocaleLowerCase())) {
                cb(null, true)
            } else {
                cb(new Error(`File type not supported. Please upload a file with one of the following extensions: ${supportedFile.toString().replaceAll('|', " ").replaceAll('/', "").replaceAll('.', "").toLocaleUpperCase()}`))
            }
        },
        limits: {
            fileSize: 5000000
        },
    })
    return uploader
}

module.exports = uploadDocument;