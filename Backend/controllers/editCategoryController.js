import sharp from "sharp";
import cloudinaryConfig from "../config/cloudinaryConfig.js";
import { cloudinaryRename, cloudinaryUpdate, fetchAssetDetails } from "../utlis/cloudinaryUpdate.js";
import { genericServerErr } from "../utlis/genericServerErr.js"
import __asset_dirname from "../assets/getAssetsDirectoryPath.js";
import Category from "../models/database models/CategoryModel.js";

const editCategoryController = async (req, res) => {
    try {
        const { categoryId, name } = req.body;
        const imageBuffer = req?.file?.buffer
        let encodedName;
        if (name) {
            encodedName = encodeURIComponent(name)
        }
        // console.log('req.body: ', req.body)
        if (!categoryId) {
            return res.status(400).json({ success: false, message: 'categoryId is required', error: 'No categoryId received' })
        }

        if(!name && !imageBuffer) {
            res.json({success: false, message: "Nothing to update!"})
        }

        const result = await Category.findOne({ name })
        if (result && result._id.toString() !== categoryId) {
            return res.status(400).json({ success: false, message: "Category with the same name already exists", error: "Dubplicate name error" })
        }

        // Replace image in cloudinary
        await cloudinaryConfig()
        const { public_id } = await fetchAssetDetails(categoryId);
        let updateResult;
        if (imageBuffer) {
            updateResult = await cloudinaryUpdate(public_id, imageBuffer)
        }
        // Rename image in cloudinary if old name and new name are different,
        // otherwise it will give error
        // (public id of the asset will change if it is renamed in cloudinary)
        let renameResult;
        if (name) {
            const newName = encodedName + `_${(new Date()).getTime()}`
            renameResult = await cloudinaryRename(public_id, newName)
        }
        // console.log("updateResult:", updateResult)
        // console.log("renameResult:", renameResult)
        // Update image in database
        const databaseUpdate = await Category.findByIdAndUpdate(categoryId,
            {
                ...(name && { name }),
                // Last query part ( ?v=${new Date().getTime() ) ensures browser
                // to reload fresh image when url changed, bypassing browser cache
                ...(imageBuffer &&
                    updateResult &&
                    { image: (updateResult?.url + `?v=${new Date().getTime()}`) }),
                ...(name &&
                    renameResult &&
                    { image: (renameResult?.url + `?v=${new Date().getTime()}`) }),
            }, {
            new: true
        }
        ).lean()

        res.status(200).json({ success: true, message: 'Category updated successfully', newImageDetails: { ...databaseUpdate } })
    } catch (error) {
        console.log(error)
        return genericServerErr(res, error)
    }
}

export default editCategoryController