import { v2 as cloudinary } from 'cloudinary'

// api to fetch image details in Cloudinary using asset id
export const fetchAssetDetails = (assetId) => {
    return new Promise((resolve, reject) => {
        cloudinary.api.resource_by_asset_id(assetId, {},
            (error, result) => {
                if (error) return reject(error)
                return resolve(result)
            }
        )
    })
}

// api to fetch image details in Cloudinary using public id
export const fetchPublicDetails = async (publicId) => {
    const result = await cloudinary.api.resource(publicId);
    return result
}

export const cloudinaryUpdate = (publicId, img) => {
    if (!Buffer.isBuffer(img)) {
        img = Buffer.from(img)
    }
    return new Promise((resolve, reject) => {
        if (!publicId) return reject('Public id is required!');

        cloudinary.uploader.upload_stream({
            public_id: publicId,
            overwrite: true,
            invalidate: true,       // ensures cloudinary deletes old image cache after new image update
        }, (error, uploadResult) => {
            if (error) {
                return reject(error)
            }
            resolve(uploadResult)
        }).end(img);
    })
}

export const cloudinaryRename = async (old_publicId, new_publicId) => {
    const renameResult = await cloudinary.uploader.rename(old_publicId, new_publicId, {
        overwrite: true,
        invalidate: true
    })
    return renameResult;
}

export const cloudinaryDelete = async (publicId)=> {
    const result = await cloudinary.api.delete_resources(publicId, {invalidate: true});
    return result
}