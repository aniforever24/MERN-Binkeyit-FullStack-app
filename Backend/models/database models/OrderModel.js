import mongoose, { Schema } from "mongoose";

// Define addressSnapshotSchema
const addressSnapshotSchema = new Schema({
    addressLine: { type: String, required: true, immutable: true },
    city: { type: String, required: true, immutable: true },
    pincode: { type: String, required: true, immutable: true },
    mobile: { type: String, immutable: true },   //  For now not required specified
    state: { type: String, immutable: true },
    country: { type: String, immutable: true },
}, { _id: false })
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

// Define productSnapshotSchema
const productSnapshotSchema = new Schema({
    name: { type: String, immutable: true, required: true },
    images: { type: [String], immutable: true, required: true },
    unit: { type: String, immutable: true, required: true },
    price: { type: Number, immutable: true, required: true },
    discount: { type: Number, immutable: true },
    categories: { type: [String], immutable: true },    // Category name will be stored
    subCategories: { type: [String], immutable: true }, // Sub categories name will be stored
    stock: { type: Number, immutable: true },
    description: { type: String, immutable: true },
    moreDetails: { type: Schema.Types.Mixed, immutable: true },
}, { _id: false })
// Define productsSchema
const productsSchema = new Schema({
    productId: { type: Schema.Types.ObjectId, ref: "Products" },
    snapshot: { type: productSnapshotSchema, required: true }
}, {_id: false})

// Define cartSnapshotSchema
const cartItemSchema = new Schema({
    cartId: String,
    product: { type: productsSchema, required: true },
    quantity: { type: Number, required: true },
}, { _id: false })

const orderSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId, ref: "Users", required: true, index: true
    },
    products: [
        {
            type: productsSchema, required: true
        }
    ],
    productDetails: [
        {
            type: cartItemSchema, required: true
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