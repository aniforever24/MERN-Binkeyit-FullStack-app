import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId, ref: "Users", required: true
    },
    products: [
        {
            type: Schema.Types.ObjectId, ref: "Products"
        }
    ],
    productDetails: [
        {
            type: Schema.Types.ObjectId, ref: "CartProducts"
        }
    ],
    paymentId: {
        type: String,
        default: ""
    },
    paymentStatus: {
        type: String,
        enum: ["", "pending", "success", "failure"],
        default: ""
    },
    paymentMode: {
        type: String,
        enum: ["", "COD", "ONLINE"],
        default: ""
    },
    deliveryAddress: {
        type: Schema.Types.Mixed,
        default: null
    },
    deliveryStatus: {
        type: String,
        enum: ["pending", "success", "cancelled"],
        default: ""
    },
    subTotalAmt: {
        type: Number,
        default: null
    },
    totalAmt: {
        type: Number,
        default: null
    },
    invoiceReceipt: {
        type: String,
        default: ""
    },
}, { timestamps: true })

const Order = mongoose.model('Orders', orderSchema);

export default Order;