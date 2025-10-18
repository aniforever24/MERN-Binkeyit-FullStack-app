import cloudinaryConfig from "../config/cloudinaryConfig.js"
import Category from "../models/database models/CategoryModel.js"
import Product from "../models/database models/ProductModel.js"
import SubCategory from "../models/database models/SubCategoryModel.js"
import { cloudinaryDelete, fetchAssetDetails } from "../utlis/cloudinaryUpdate.js"
import { genericServerErr } from "../utlis/genericServerErr.js"

const deleteCategoryController = async (req, res) => {
  try {
    const { categoryId } = req.body
    // Convert categoryId to objectId

    // First make sure if this category id is not being in use elswhere
    // (like in products and in subcategories)
    const countInSubCategory = await SubCategory.countDocuments({
      categories: { $in: [categoryId] }
    })
    const countInProduct = await Product.countDocuments({
      categories: { $in: [categoryId] }
    })
    if (countInSubCategory > 0 || countInProduct > 0) {
      return res.status(403).json({ success: false, message: "This category is in use, so it cannot be deleted", error: "Cannot delete this category", data: { countInSubCategory, countInProduct } })
    }

    // get publicId from cloudinary from categoryId and delete 
    await cloudinaryConfig()
    let cloudinary_Error;
    try {
      const { public_id } = await fetchAssetDetails(categoryId)
      const result = await cloudinaryDelete(public_id);
    } catch (error) {
      if (error.http_code === 404)
        console.log(error)
      cloudinary_Error = error;
    }

    // delete image from database 
    const dbResult = await Category.deleteOne({ _id: categoryId }).lean()

    res.status(200).json({ success: true, message: "Category deleted successfully", data: { dbResult, cloudinary_Error } })
  } catch (error) {
    console.log(error)
    return genericServerErr(res, error)
  }
}

export default deleteCategoryController
