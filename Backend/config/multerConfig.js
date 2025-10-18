import multer from "multer";

const storage = multer.memoryStorage()
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5,   // limit file size to 5 mb   
        files: 1,    // limit to 1 max file per request
    },
    fileFilter: (req, file, cb) => {
        if (file && !file?.mimetype.startsWith('image')) {
            return cb(new Error('Unsupported file type. Only image file is allowed'))
        }
        cb(null, true)
    }
})
export default upload

// multer function to handle multiple files upload
export const uploadMany = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5,  // limit file size to 5 mb        
    },
    fileFilter: (req, file, cb) => {
        if (file && !file?.mimetype.startsWith('image')) {
            return cb(new Error('Unsupported file type! Only image files are allowed.'))
        }
        cb(null, true)
    }
})