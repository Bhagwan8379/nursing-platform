const multer = require("multer")
const path = require("path")

const Storage = multer.diskStorage({
    filename: (req, file, cb) => {
        const fn = Date.now() + path.extname(file.originalname)
        cb(null, fn)
    }
})

exports.upload = multer({ storage: Storage }).fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'degreeCertificate', maxCount: 2 },
    { name: 'nursingCouncilCertificate', maxCount: 2 },
    { name: 'idProof', maxCount: 1 },
    { name: 'addressProof', maxCount: 1 },
])