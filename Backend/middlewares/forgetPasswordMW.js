import User from "../models/database models/UserModel.js";
import { genericServerErr } from "../utlis/genericServerErr.js";

const forgotPasswordMW = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required", error: 'Email is empty' })
        }
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ success: false, message: "Email is not registered", error: 'Email not found in database!' })
        }
        req.body.name = user.name;
        req.body.id = user._id.toString();
        next()
    } catch (error) {
        console.log(error)
        genericServerErr(res, error);
    }
}

export default forgotPasswordMW;