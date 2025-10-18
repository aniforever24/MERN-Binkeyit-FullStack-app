import express from "express";
import { genericServerErr } from "../utlis/genericServerErr.js";
import sharp from "sharp";
import cloudinaryConfig from "../config/cloudinaryConfig.js";
import cloudinaryUpload from "../utlis/cloudinayUpload.js";
import SubCategory from "../models/database models/SubCategoryModel.js";
import Category from "../models/database models/CategoryModel.js";

const uploadSubCategoryController = async (req, res) => {
    try {
        const { name } = req.body;
        const category = JSON.parse(req.body?.category)
        const imgBuffer = req?.file?.buffer;

        // name and image validation
        if (!name || !imgBuffer) {
            return res.status(400).json({ success: false, message: "Name and image are required", error: "Empty name or image received!" })
        }
        // category validation
        if (!Array.isArray(category)) {
            return res.status(400).json({ success: false, message: "Category must be an array", error: "Category is not an array" })
        } else if (!category[0]) {
            return res.status(400).json({ success: false, message: "At lease one Category is required", error: "No Category received" })
        }

        const categoryIds = category.map((cat, i) => {
            return cat._id
        })
        // console.log("categoryIds:", categoryIds)

        // Check if all category ids provided are valid
        const checkCategories = await Category.find({ _id: { $in: categoryIds } });

        if (checkCategories.length !== categoryIds.length) {
            return res.status(400).json({ success: false, message: "One or more category ids are invalid", error: "One or more of the Category ids not found in database" })
        }

        const encodedName = encodeURIComponent(name)

        // Optimise image using sharp
        const optimisedImg = await sharp(imgBuffer)
            .resize(500)
            // .jpeg({ quality: 80 })
            .toBuffer()

        // Upload image to cloudinary
        await cloudinaryConfig()
        const uploadResult = await cloudinaryUpload(optimisedImg, encodedName, 'Binkeyit/sub_categories')
        const { asset_id, url } = uploadResult;

        // Check if no subCategory exists with the same name
        const checkName = await SubCategory.findOne({ name })
        if(checkName) {
            return res.status(400).json({success: false, message: "Sub Category with the same name already exists", error: "Duplicate name error"})
        }

        // Upload data to database
        const payload = {
            name,
            categories: categoryIds,
            image: url
        }
        const newSubCategory = new SubCategory(payload);
        const uploadedSubCategory = await newSubCategory.save()

        // const findResult = await SubCategory.find({ name: "Atta" }).populate('categories')

        return res.status(201).json({ success: true, message: 'New Sub Category created successfully', data: { asset_id, url, uploadResult, uploadedSubCategory } })
    } catch (error) {
        console.log('uploadSubCategoryController error: ', error)
        return genericServerErr(res, error)
    }
}

export default uploadSubCategoryController