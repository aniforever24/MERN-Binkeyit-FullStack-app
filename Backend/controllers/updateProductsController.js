import sharp from "sharp";
import cloudinaryConfig from "../config/cloudinaryConfig.js";
import Product from "../models/database models/ProductModel.js";
import { cloudinaryDelete, cloudinaryUpdate, fetchPublicDetails } from "../utlis/cloudinaryUpdate.js";
import cloudinaryUpload from "../utlis/cloudinayUpload.js";
import { genericServerErr } from "../utlis/genericServerErr.js";

const updateProductsController = async (req, res) => {
    try {
        const { name, description, unit, stock, price, discount, published, imgs: imgss, id } = req.body;

        if (!id) {
            return res.status(400).json({ success: false, message: "Product id is required", error: 'No product id received!' })
        }
        // Check if this product exists in db
        const product = await Product.findById(id).select('images');
        if (!product) {
            return res.status(400).json({ success: false, message: 'Product not found!', error: 'No products found with this id in database' })
        }
        const originalImages = product.images;

        const images = req.files;

        const categories = JSON.parse(req.body.categories)
        const subCategories = JSON.parse(req.body.subCategories)
        const moreDetails = JSON.parse(req.body.moreDetails)
        const imgs = imgss && JSON.parse(imgss);

        // if (!name || !description || !categories[0] || !unit || !stock || !price) {
        //     return res.status(400).json({ success: false, message: "Fields marked with * are required.", error: "One or more of required fields are empty!" })
        // }   

        // Get an array of all uploaded image names
        const imgNames = images && Array.isArray(images) && (images.map((img, _) => {
            const ind = img?.originalname.lastIndexOf('.')
            const originalname = img?.originalname.slice(0, ind)
            const encoded_name = encodeURIComponent(originalname)
            return encoded_name
        }))

        // Optimised images buffer array
        const optimisedImages = images && images[0] && await Promise.all(images.map((image) => {
            const optimised = sharp(image.buffer).resize(500).toBuffer()
            return optimised;
        }))

        // Get list of old images deleted by user (not part of 'imgs') from
        // product original images
        const deletedImgs = originalImages.filter((image) => {
            if(!Array.isArray(imgs)) {
                throw Error('"imgs" must be an array!')
            }
            const deleted = imgs[0] && imgs.some((img) => image?.metadata?.public_id === img?.metadata?.public_id)
            return !deleted;
        })
        // console.log('deletedImgs:', deletedImgs)

        // Cloudinary handshake
        await cloudinaryConfig()
        // Remove deleted images from cloudinary 
        try {
            const deletedPublicIds = deletedImgs[0] && deletedImgs.map((img) => {
                const { public_id: publicId } = img.metadata;
                return publicId;
            })
            cloudinaryDelete(deletedPublicIds);            
        } catch (error) {
            console.log("Error in deleting image from cloudinary:", error)
        }

        // It can act like a unique id to this request
        const dateId = Date.now();
        // Upload images to cloudinary in the same product folder
        const uploadResults = optimisedImages && optimisedImages[0] && await Promise.all(optimisedImages.map((imgBuffer, i) => {
            const publicId = `${imgNames[i]}_${dateId}`;
            const { public_id } = originalImages[0].metadata
            const index = public_id.lastIndexOf('/')
            const folder = public_id.slice(0, index)

            const uploadResult = cloudinaryUpload(imgBuffer, publicId, folder)
            return uploadResult
        }));

        // Extract required images details
        const uploadedImageDetails = uploadResults && uploadResults.map((result) => {
            const { asset_id, public_id, url } = result
            return { url, metadata: { asset_id, public_id, } }
        })

        // Extract cover and rest images from images files
        const [cover, ...restImageFiles] = uploadedImageDetails && uploadedImageDetails[0] ? uploadedImageDetails : [];
        const coverImage = cover ? [cover] : [];

        const combinedImages = [...coverImage , ...(imgs || []), ...restImageFiles]
        // return console.log('combinedImages:', combinedImages)
        // Update product details in database
        const updateResult = await Product.findByIdAndUpdate(id, {
            ...(name && { name }),
            ...(description && { description }),
            ...(unit && { unit }),
            ...(stock && { stock }),
            ...(price && { price }),
            ...(discount && { discount }),
            ...(published && { published }),
            ...(combinedImages && {images: [...combinedImages]}),
            ...(Array.isArray(categories) && categories[0] && { categories }),
            ...(Array.isArray(subCategories) && { subCategories }),
            ...(moreDetails && { moreDetails }),
        }, {
            runValidators: true,
            new: true
        })

        res.status(201).json({ success: true, message: 'Product updated successfully ✔', data: { updateResult } })

    } catch (error) {
        console.log('Error in update products controller:', error)
        return genericServerErr(res, error);
    }
}

export default updateProductsController;
