import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        default: "",
        unique: true,
    },
    image: {
        type: String,
        default: ""
    },
}, { timestamps: true })

const Category = mongoose.model('Category', categorySchema);

export default Category;