import Products from "../models/database models/ProductModel.js";
import { genericServerErr } from "../utlis/genericServerErr.js"

const getProductsController = async (req, res) => {
    try {
        let { page = 1, limit = 10, sort = { createdAt: -1 }, query = {}, populate = [], select = "", lean = false, score = false, searchText="", searchMode = false } = req.body;
        
        let popul = [];
        let skip = parseInt(page - 1) * parseInt(limit);
        if (skip >= 100) {
            skip = 100
        };
        if (populate[0] && populate.length <= 2) {
            checkPopulate('categories', populate) || checkPopulate('subCategories', populate) ? (
                popul = [...populate]) : []
        }

        // Get total number of products from database
        let count = await Products.countDocuments(query);

        // Fallback code if search returns 0 products i.e. count is 0
        if (searchMode && searchText && count === 0) {
            query = {
                name: { $regex: searchText, $options: "i"}
            };
            score = false;
            sort = { createdAt: -1};
            count = await Products.countDocuments(query)
        }
        // console.log('query:', query)
        // Get products from database
        const products = await Products.find(query, score ? { score: { $meta: "textScore" } } : {})
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .populate(popul[0])
            .populate(popul[1])
            .select(select)
            .lean(lean)

        return res.status(200).json({ success: true, message: 'Products received successfully.', data: { count, products } })
    } catch (error) {
        console.log('Error from getProductsController:>>', error)
        return genericServerErr(res, error)
    }

    function checkPopulate(str, array) {
        return array.some((el) => el === str)
    }
}

export default getProductsController