import { genericServerErr } from "../utlis/genericServerErr.js";
import User from "../models/database models/UserModel.js";
import loginSchema from "../models/validation models/loginValidationJOISchema.js";

const loginValidatorMW = async (req, res, next) => {
    try {
        let { email, password } = req.body;
        email = email?.trim();
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Both fields are required, email & password", error: 'Email or password or both null or empty!' })
        }
        // Validation
        const { value, error } = loginSchema.validate({ email, password });
        if (error) {
            return res.status(400).json({ status: false, message: "Invalid credentials", error: error?.message || error })
        }


        // If email exists or not and email verification is true/false in database
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Unregistered user. Please sign up first", error: 'Email not found in database' })
        } else if (!user.emailVerified && user.status !== 'Active') {
            return res.status(403).json({ success: false, message: "Please verify your email first. Use signup form to get verification email.", error: 'Email registered but not verified.' })
        }
        req.body.email = email.trim();
        req.body.user = user;
        next()
    } catch (error) {
        genericServerErr(res, error)
        return
    }
}

export default loginValidatorMW