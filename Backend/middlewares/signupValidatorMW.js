import { genericServerErr } from "../utlis/genericServerErr.js";
import signupSchema from "../models/validation models/signupValidationJOISchema.js";
import User from "../models/database models/UserModel.js";

const signupValidatorMW = async (req, res, next) => {
    try {
        let { name, email, password, confPassword } = req.body;

        // check if email already exists and verify email is false in database
        if (email) {
            const user = await User.findOne({ email }).select('emailVerified email');
            if (user) {
                if (user.emailVerified) {
                    return res.status(403).json({ success: false, message: "Email already exists and verified. Please login.", error: "Email already exists." })
                } else {
                    req.body.user = user;
                    return next()
                }
            }
        } else return res.status(400).json({ success: false, message: 'email is required', error: 'no email is provided' })

        const { value, error } = signupSchema.validate({
            name: name,
            email: email,
            password: password,
            confPassword: confPassword
        });

        if (error) {
            return res.status(400).json({ success: false, message: "Invalid credentials (name, email, password or confirm password!", error: error?.details[0].message })
        }
        req.body = { ...req.body, ...value };
        next()
    } catch (error) {
        genericServerErr(res, error)
    }
}

export default signupValidatorMW