import mongoose, { Schema } from "mongoose";

const addressSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "userId is required"]
    },
    addressLine: { 
        type: String,
        default: "",
        required: [true, 'address line is required']
    },
    city: { 
        type: String,
        default: "",
        required: [true, 'city is required']
    },
    state: { 
        type: String,
        default: "",
        required: [true, 'state is required']
    },
    pincode: { 
        type: Number,
        default: "",
        required: [true, 'pincode is required']
    },
    country: { 
        type: String,
        default: "",
        required: [true, 'country is required']
    },
    mobile: { 
        type: Number,
        default: ""
    },
}, { timestamps: true })

const Address = mongoose.model('Address', addressSchema);

export default Address;