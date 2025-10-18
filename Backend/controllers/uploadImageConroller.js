import sharp from "sharp";
import cloudinaryConfig from "../config/cloudinaryConfig.js";
import cloudinaryUpload from "../utlis/cloudinayUpload.js";
import { genericServerErr } from "../utlis/genericServerErr.js"

const uploadImageController = async (req, res) => {
    try {
        const folder = req.body?.folder
        const name = req.body?.name
        const img = req?.file
        const imgBuffer = img?.buffer;

        let nameEncoded;
        if (name) nameEncoded = encodeURIComponent(name)
        // console.log(img?.originalname)
        const imageName = nameEncoded || encodeURIComponent(img?.originalname) || "";

        if (!folder || !img) {
            return res.status(400).json({ success: false, message: 'Folder name and Image both are required', error: 'Folder name or Image file is missing' })
        }

        // process image for web
        const processedImg = await sharp(imgBuffer)
            .jpeg({ quality: 80 })
            .toBuffer()

        // upload image to cloudinary
        await cloudinaryConfig()
        const uploadResult = await cloudinaryUpload(processedImg, imageName, folder && `Binkeyit/${folder}`)

        return res.status(200).json({ success: true, message: 'Image successfully uploaded', data: uploadResult })

    } catch (error) {
        console.log("uploadImageController error: ", error)
        return genericServerErr(res, error)
    }
}

export default uploadImageController