import mongoose, { Schema } from "mongoose";

const subCategorySchema = new Schema({
    name: {
        type: String,
        default: "",
        unique: [true, "Name of the Sub-category already exists"]
    }
    ,
    image: {
        type: String,
        default: ""
    }
    ,
    categories: [
        {
            type: String, ref: "Category"
        }
    ]
}, { timestamps: true })

// Create index on createdAt
subCategorySchema.index({createdAt: -1})

const SubCategory = mongoose.model('SubCategory', subCategorySchema);

export default SubCategory;