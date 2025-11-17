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
        type: String,
        default: "",
        required: [true, "Pincode is required"],
        validate: {
            validator: (v)=> /^\d+$/.test(v),
            message: "pincode must contain only numbers!"
        }
    },
    country: { 
        type: String,
        default: "",
        required: [true, 'country is required']        
    },
    mobile: { 
        type: String,
        default: "",
        required: false,
        validate: {
            validator: (v)=> {
                // Allow skipping mobile number
                if(!v || !v.trim()) return true;
                return (/^\d+$/.test(v) && v.length >= 10);
            },
            message: "Please input valid mobile number (min 10 digits)"
        }
    },
    isDefault: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true })

const Address = mongoose.model('Address', addressSchema);

export default Address;