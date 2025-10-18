import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema({
    userId: [
        {
            type: Schema.Types.ObjectId, ref: "Users"
        }
    ],
    orderId: {
        type: String,
        required: true
    },
    productId: [
        {
            type: Schema.Types.ObjectId, ref: "Products"
        }
    ],
    productDetails: {},
    paymentId: { 
        type: String,
        default: ""
    },
    paymentStatus: { 
        type: String,
        default: ""
    },
    deliveryAddress: {},
    deliveryStatus: { 
        type: String,
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
}, { timestamps: true } )

const Order = mongoose.model('Orders', orderSchema);

export default Order;