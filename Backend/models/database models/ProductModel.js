import mongoose, { Schema } from "mongoose";

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    images: [
        {
            url: { type: String, required: true },
            metadata: { type: Schema.Types.Mixed }
        }
    ],
    categories: [
        {
            type: String,
            ref: 'Category',
            required: true
        }
    ],
    subCategories: [
        {
            type: Schema.Types.ObjectId, ref: "SubCategory"
        }
    ],
    unit: {
        type: String,
        default: "",
        required: true,
        maxLength: 12
    },
    stock: {
        type: Number,
        required: true,
        min: 0
    },
    price: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
        min: 0
    },
    description: {
        type: String,
        default: ""
    },
    moreDetails: {
        type: Schema.Types.Mixed,
        default: {}
    },
    published: {
        type: Boolean,
        default: false
    },
}, { timestamps: true })

// Setting Index
productSchema.index({ published: 1, createdAt: -1 })
productSchema.index({ createdAt: -1 })
productSchema.index({ updatedAt: -1 })
productSchema.index({ name: 1 })

// Setting a text index for relevance search
productSchema.index({ 
    name: "text", 
    description: "text" 
},
{
    weights: {
        name: 2,
        description: 1
    }
}
)

const Product = new mongoose.model('Products', productSchema);

export default Product