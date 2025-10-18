import Category from "../models/database models/CategoryModel.js";
import { genericServerErr } from "../utlis/genericServerErr.js"

const getCategoriesController = async (req, res) => {
    try {
        let { sort, find, query = {} } = req.body
        
        if (!sort) {
            sort = { name: 1 }
        }

        const allCategories = await Category.find(find).sort(sort);
        if (!allCategories) {
            return res.json({ success: false, message: 'No Categories found!', error: "No categories received from db" })
        }
        const count = await Category.countDocuments(query)

        return res.status(200).json({ success: true, message: "Categories retrieved successfully", data: { allCategories, count } })
    } catch (error) {
        return genericServerErr(res, error)
    }
}

export default getCategoriesController