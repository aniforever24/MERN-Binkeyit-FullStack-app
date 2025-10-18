import cloudinary from 'cloudinary'

// Take image as buffer or image file
const cloudinaryUpload = (img, publicId = "", folder = 'Binkeyit/avatar') => {
    if (!Buffer.isBuffer(img)) {
        img = Buffer.from(img)
    }
    return new Promise((resolve, reject) => {
        cloudinary.v2.uploader.upload_stream({ folder: folder, public_id: publicId }, (error, uploadResult) => {
            if (error) {
                return reject(error)
            }
            resolve(uploadResult)
        }).end(img);
    })
}

export default cloudinaryUpload;