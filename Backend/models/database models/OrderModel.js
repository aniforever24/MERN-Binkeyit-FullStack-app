import mongoose, { Schema } from "mongoose";

// Define addressSnapshotSchema
const addressSnapshotSchema = new Schema({
    addressLine: { type: String, required: true, immutable: true },
    city: { type: String, required: true, immutable: true },
    pincode: { type: String, required: true, immutable: true },
    mobile: { type: String, immutable: true },   //  For now not required specified
    state: { type: String, immutable: true },
    country: { type: String, immutable: true },
},
    { _id: false }
)

// Define deliveryAddressSchema
const deliveryAddressSchema = new Schema({
    addressId: {
        type: Schema.Types.ObjectId,
        ref: "Address",
        required: true
    },
    snapshot: {
        type: addressSnapshotSchema,
        required: true,
    }
}, { _id: false })

const orderSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId, ref: "Users", required: true, index: true
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
    sessionId: {
        type: String,
        unique: true,
        sparse: true,
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failure"],
        default: "pending"
    },
    paymentMode: {
        type: String,
        enum: ["COD", "ONLINE"],
        required: true,
    },
    deliveryAddress: {
        type: deliveryAddressSchema,
        required: true,
    },
    deliveryStatus: {
        type: String,
        enum: ["pending", "delivered", "cancelled"],
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