import { genericServerErr } from "../utlis/genericServerErr.js";
import sharp from "sharp";
import cloudinaryConfig from '../config/cloudinaryConfig.js'
import cloudinaryUpload from "../utlis/cloudinayUpload.js";
import User from "../models/database models/UserModel.js";

const uploadAvatarController = async (req, res) => {
    const { id, accessTokenExpiry } = req;  // irrelevant to user
    try {
        console.log("Avatar Image file: ",req.file)
        const img = req?.file?.buffer;

        if (!img) {
            return res.status(400).json({ success: false, message: 'No avatar file found!', error: 'No avatar file received to upload' })
        }

        const processedImg = await sharp(img)
            .resize(500)
            .jpeg({ quality: 80 })
            .toBuffer()

        // uploade image buffer to cloudinary to get url
        await cloudinaryConfig()
        const uploadedImgDetails = await cloudinaryUpload(processedImg, 'avatar')
        const { url, secure_url } = uploadedImgDetails;
        
        // Upload avatat url to db
        await User.updateOne({ _id: id }, { $set: { avatar: url } }, { runValidators: true })

        res.status(201).json({ success: true, message: "Avatar uploaded successfully", data: { url, secure_url } })
        
    } catch (error) {
        // console.log(error);
        genericServerErr(res, error);
    }
}

export default uploadAvatarController;