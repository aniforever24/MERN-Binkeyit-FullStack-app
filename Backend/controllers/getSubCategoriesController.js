import SubCategory from "../models/database models/SubCategoryModel.js"
import { genericServerErr } from "../utlis/genericServerErr.js"

const getSubCategoriesController = async (req, res) => {
    try {
        let { page = 1, limit = 10, sort = { createdAt: -1 }, query = {}, populate = true} = req.body;
        const skip = (page - 1) * limit

        if(populate) {
            populate = 'categories'
        }

        const totalSubcategories = await SubCategory.countDocuments(query)
        const subCategories = await SubCategory.find(query)
            .sort(sort)
            .populate(populate)
            .skip(skip)
            .limit(limit)

        return res.status(200).json({ success: true, data: subCategories, totalNo: totalSubcategories })
    } catch (error) {
        console.log('Error from getSubCategoriesController:  ', error)
        return genericServerErr(res, error)
    }
}

export default getSubCategoriesController;