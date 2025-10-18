import mongoose, { Schema } from "mongoose";

const addressSchema = new Schema({
    addressLine: { 
        type: String,
        default: ""
    },
    city: { 
        type: String,
        default: ""
    },
    state: { 
        type: String,
        default: ""
    },
    pincode: { 
        type: Number,
        default: ""
    },
    country: { 
        type: String,
        default: ""
    },
    mobile: { 
        type: Number,
        default: ""
    },
}, { timestamps: true })

const Address = mongoose.model('Address', addressSchema);

export default Address;