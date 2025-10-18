import sharp from "sharp";
import { genericServerErr } from "../utlis/genericServerErr.js"
import cloudinaryUpload from "../utlis/cloudinayUpload.js";
import cloudinaryConfig from "../config/cloudinaryConfig.js"
import Product from "../models/database models/ProductModel.js";

const uploadProductsController = async (req, res) => {
    try {
        const { name,
            description,
            unit,
            stock,
            price,
            discount,
            categories: categ,
            subCategories: subCateg,
            moreDetails: moreDet,
            published } = req.body;
        const images = req.files;

        const categories = categ && JSON.parse(req.body.categories)
        const subCategories = subCateg && JSON.parse(req.body.subCategories)
        const moreDetails = moreDet && JSON.parse(req.body.moreDetails)

        if (!name || !description || !categories[0] || !unit || !stock || !price) {
            return res.status(400).json({ success: false, message: "Fields marked with * are required.", error: "One or more of required fields are empty!" })
        }
        // Encode name after slicing it to 40 characters so that % does not appear in last which can induce invalid error in cloudinary
        const encodedName = encodeURIComponent(name.slice(0, 40));
        // Getting an array of all uploaded image names
        const imgNames = images.map((img, _) => {
            const ind = img?.originalname.lastIndexOf('.')
            const originalname = img?.originalname.slice(0, ind)
            const encoded_name = encodeURIComponent(originalname)
            return encoded_name
        })

        // Optimised images buffer array
        const optimisedImgs = images[0] && await Promise.all(images.map((image) => {
            const optimised = sharp(image.buffer).resize(500).toBuffer()
            return optimised;
        }))

        // Upload images to cloudinary
        await cloudinaryConfig()    // Authorization handshake
        const dateId = Date.now();    // It can act like a unique id to this request
        const uploadResults = optimisedImgs[0] && await Promise.all(optimisedImgs.map((imgBuffer, i) => {
            const publicId = `${imgNames[i]}_${dateId}`;
            let folder = `Binkeyit/products/${encodedName}_${dateId}`;

            const uploadResult = cloudinaryUpload(imgBuffer, publicId, folder);
            return uploadResult;
        }))
        // Extract required images details
        const uploadedImgDetails = uploadResults.map((result) => {
            const { asset_id, public_id, url } = result
            return { url, metadata: { asset_id, public_id, } }
        })

        // Upload product to database operations
        const newProduct = new Product({
            name,
            description,
            images: [...uploadedImgDetails],
            categories,
            subCategories,
            unit,
            stock,
            price,
            discount: discount && discount,
            published,
            moreDetails,
        })
        const uploadedProduct = await newProduct.save();

        res.status(201).json({ success: true, message: 'Product uploaded successfully.', data: { uploadedImgDetails, uploadedProduct } })

    } catch (error) {
        console.log('Error from uploadProductsController:', error)
        return genericServerErr(res, error)
    }
}

export default uploadProductsController
