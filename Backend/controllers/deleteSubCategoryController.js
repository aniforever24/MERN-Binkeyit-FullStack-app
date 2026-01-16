import { genericServerErr } from "../utlis/genericServerErr.js"
import cloudinaryConfig from "../config/cloudinaryConfig.js";
import { fetchAssetDetails, cloudinaryDelete, fetchPublicDetails } from "../utlis/cloudinaryUpdate.js";
import { getCloudinaryPublicId, getLocalDateString } from "../utlis/utilities.js";
import SubCategory from "../models/database models/SubCategoryModel.js";
import Product from "../models/database models/ProductModel.js";


const deleteSubCategoryController = async (req, res) => {
    try {
        const { subCategoryid, image } = req.body;
        // console.log(subCategoryid, image)

        // Check if this subCategory is in use elswhere
        const result = await Product.countDocuments({
            subCategories: { $in: [subCategoryid] }
        })
        if (result) {
            return res.status(403).json({
                success: false,
                message: "This sub category is in use so cannot be deleted",
                error: "sub category cannot be deleted",
                data: { countOfProducts: result }
            })
        }

        // Extract cloudinary public id from image
        const publicId = getCloudinaryPublicId(image)

        // Delete sub category asset from cloudinary
        await cloudinaryConfig()
        try {
            await cloudinaryDelete(publicId);
        } catch (error) {
            if (error.http_code === 404)
                console.log(error)
            cloudinary_Error = error;
        }

        // Delete sub category from database
        const deleteResult = await SubCategory.deleteOne({ _id: subCategoryid })

        // return res.json({ publicId, imagePublicDetails, rate_limit_reset_at })
        return res.status(200).json({ success: true, message: "Sub category deleted successfully", data: { deleteResult } })

    } catch (error) {
        console.log(error)
        return genericServerErr(res, error)
    }
}

export default deleteSubCategoryController