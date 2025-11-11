import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "name is required"],
        min: [3, "Name must be of atleast 3 characters."],
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: [true, "Email already exists!"],
        validate: {
            validator: function (val) {
                const valid = /^[a-zA-Z0-9._]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val);
                return valid;
            },
            message: props => `${props.value} is not a valid email. Only alphabets, number, . and _ are allowed!`
        },
    },
    password: {
        type: String,
        required: true,
        minLength: [6, "Password must be at least 6 characters"],
        // validate: {
        //     validator: function (v) {
        //         const valid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*_.\\\/])[A-Za-z\d!@#$%^&*_.\\\/]{8,}$/;
        //         return valid;
        //     },
        //     message: props => `Password must contain at least one lowercase, one uppercase, one number, one special character and minimum length must be 8`
        // }
    },
    avatar: { 
        type: String,
        default: ""
    },
    mobile: {
        type: Number,
        default: null
    },
    mobileVerifed: {
        type: Boolean,
        default: false
    },
    mobileOTP: {
        type: String,
        default: ""
    },
    refreshToken: { 
        type: String,
        default: ""
    },
    emailVerified: { 
        type: Boolean,
        default: false
    },
    last_login_date: { 
        type: Date,
        default: ""
    },
    status: {
        type: String,
        enum: ["Active", "Inactive", "Suspended"],
        default: "Inactive"
    },
    addressDetails: [
        {
            type: Schema.Types.ObjectId, ref: "Address"
        },
    ],
    shoppingCart: [
        {
            type: Schema.Types.ObjectId, ref: "CartProducts"
        },
    ],
    orderHistory: [],
    forgotPasswordOTP: { 
        type: String,
        default: ""
    },
    forgotPasswordExpiry: { 
        type: Date,
        default: ""
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER"
    },
    runOnce: {
        type: Boolean,
        default: false,
    }
},
    { timestamps: true });

const User = mongoose.model('Users', userSchema);

export default User;
