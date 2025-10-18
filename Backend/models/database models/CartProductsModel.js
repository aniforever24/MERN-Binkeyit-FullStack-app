import mongoose, { Schema } from "mongoose";

const cartProductsSchema = new Schema({
    product: {
            type: Schema.Types.ObjectId, ref: "Products"
        },
    quantity: { 
        type: Number,
        default: ""
    },
    user: {
            type: Schema.Types.ObjectId, ref: "Users"
        },
}, { timestamps: true })

const CartProduct = mongoose.model('CartProducts', cartProductsSchema);

export default CartProduct;