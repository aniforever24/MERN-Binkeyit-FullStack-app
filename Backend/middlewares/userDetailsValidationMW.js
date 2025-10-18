import updateUserDetailsSchema from "../models/validation models/updateUserDetailsJOISchema.js";
import { genericServerErr } from "../utlis/genericServerErr.js"

const userDetailsValidationMW = async (req, res, next) => {
    try {
        let { name, email, password, mobile } = req.body;
        mobile = mobile?.toString()
        if (!(name || email || password || mobile)) {
            return res.status(400).json({ success: false, message: 'Nothing to update', error: 'All fields are empty' })
        }

        // Validation of values
        const { value, error } = updateUserDetailsSchema.validate({
            name: name,
            email: email,
            password: password,
            mobile: mobile
        });
        if (error) {
            return res.status(400).json({ success: false, message: "Invalid credentials (name, email, password or mobile!)", error: error?.details[0].message })
        }
        Object.assign(req.body, value);

        next()
    } catch (error) {
        genericServerErr(res, error)
    }
}

export default userDetailsValidationMW