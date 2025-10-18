import sharp from "sharp";
import { genericServerErr } from "../utlis/genericServerErr.js";
import cloudinaryConfig from "../config/cloudinaryConfig.js";
import cloudinaryUpload from "../utlis/cloudinayUpload.js";
import Category from "../models/database models/CategoryModel.js";

const uploadCategoryController = async (req, res) => {
    try {
        const img = req?.file?.buffer       // storing image buffer in img
        const { name } = req.body

        if (!img || !name) {
            return res.status(400).json({ success: false, message: 'Both fields are required', error: "Name or Image is missing!" })
        }

        // processing image for web use using sharp package
        const processedImg = await sharp(img)
            .resize(500)
            .toBuffer()

        const encodedName = encodeURIComponent(name)    // encode name to avoid unnecessary naming error while uploading image to cloudinary

        // uploading image to cloudinary
        await cloudinaryConfig();
        const uploadResult = await cloudinaryUpload(processedImg, encodedName, 'Binkeyit/categories')
        // console.log("uploadResult:", uploadResult)
        const { url, asset_id } = uploadResult;

        // Upload Category if database has no category with the same name
        const result = await Category.findOne({ name })
        let uploadedCategory;
        if (!result) {
            // use cloudinary image assetId as database category id
            const newCategory = new Category({
                name, image: url, _id: asset_id,
            })
            uploadedCategory = await newCategory.save()
        } else {
            return res.status(400).json({ success: false, message: 'Category with this name already exists', error: 'Category with this name already exists' })
        }

        return res.status(200).json({ success: true, message: 'New Category successfully created', data: { name, image: url, id: asset_id } })
    } catch (error) {
        return genericServerErr(res, error)
    }
}

export default uploadCategoryController;