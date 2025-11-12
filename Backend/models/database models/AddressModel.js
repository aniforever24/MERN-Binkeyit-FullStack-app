import mongoose, { Schema } from "mongoose";

const addressSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
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