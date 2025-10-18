import sharp from "sharp";
import cloudinaryConfig from "../config/cloudinaryConfig.js";
import { genericServerErr } from "../utlis/genericServerErr.js"
import { cloudinaryRename, cloudinaryUpdate } from "../utlis/cloudinaryUpdate.js";
import SubCategory from "../models/database models/SubCategoryModel.js";
import { getCloudinaryPublicId } from "../utlis/utilities.js";

const editSubCategoryController = async (req, res) => {
    try {
        // url is the cloudinary url of the previous image of the sub category, required for extracting cloudinary public id of image
        const { name, categories, subCategoryId, url } = req.body;
        const imageBuffer = req.file?.buffer

        if (!subCategoryId) {
            res.status(400).json({ success: false, message: "Sub category id is required.", error: "No Sub category id received!" })
        }

        // Check if subcategory with the provided subCategoryId exists
        const checkSubCategory = await SubCategory.findOne({ _id: subCategoryId })
        if(!checkSubCategory) {
            res.status(400).json({success: false, message: "No sub category exists with provided id", error: "Provided sub category id is not valid!"})
        }

        if (!url) {
            res.status(400).json({ success: false, message: "url of the previous sub category image is required", error: "No url received!" })
        }
        // If all trio are undefined or haa no value
        if (!name && !categories && !imageBuffer) {
            res.json({ success: false, message: "Nothing to update!" })
        }

        // Check if any other document (excluding the one being updating) with the same name already exists in database
        if (name) {
            const document = await SubCategory.findOne({ name })
            if (document && document._id.toString() !== subCategoryId) {
                return res.status(400).json({ success: false, message: "Sub category with the same name already exists!", error: "Duplicate name error" })
            }
        }

        // Parse categories into an array object and get array of ids
        const parsedCateg = JSON.parse(categories)
        const categoryIds = parsedCateg.map((c) => {
            return c._id.toString()
        })

        // Extract cloudinary public id of the realted asset from image url
        
        const publicId = getCloudinaryPublicId(url)

        // optimise image
        let optimisedImg;
        if (imageBuffer) {
            optimisedImg = await sharp(imageBuffer)
                .resize(500)
                .toBuffer()
        }

        // update image in cloudinary
        let cloudiResult;
        if (imageBuffer) {
            await cloudinaryConfig()
            cloudiResult = await cloudinaryUpdate(publicId, optimisedImg)
        }

        // Rename image in cloudinary, changes public id (and so url) of the image
        let renameResult;
        if (imageBuffer && name) {
            const newName = encodeURIComponent(name) + `_${(new Date()).getTime()}`
            renameResult = await cloudinaryRename(publicId, newName)
        }

        // Update Sub category in database
        const updateResult = await SubCategory.findByIdAndUpdate({ _id: subCategoryId }, {
            $set: {
                ...(name && { name }),
                ...(categories[0] && { categories: categoryIds }),
                ...(imageBuffer && { image: cloudiResult?.url }),    // If only new image is provided 
                ...(imageBuffer && name && { image: renameResult?.url })     // If name & new image both are provided
            }
        }, {
            new: true
        })

        res.status(201).json({ success: true, message: "Sub category updated successfully ✔", data: updateResult });

    } catch (error) {
        console.log('Error from editSubCategoryController:', error)
        return genericServerErr(res, error)
    }
}

export default editSubCategoryController