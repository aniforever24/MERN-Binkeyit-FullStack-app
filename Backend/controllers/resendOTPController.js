import sendVerificationEmail from "../config/verifiicationEmail.js";
import User from "../models/database models/UserModel.js";
import forgotPasswordTemplate from "../utlis/forgotPasswordTemplate.js";
import { genericServerErr } from "../utlis/genericServerErr.js";
import { generateForgotPasswordOTP } from "../utlis/utilities.js";

const resendOTPController = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(401).json({ success: false, message: "Email is required", error: 'Unathorised request' })
        }
        const otp = generateForgotPasswordOTP();
        const now = new Date();
        const expDuration = 30 * 60 * 1000  // milliseconds
        const expiryDt = new Date(now.getTime() + expDuration);
        // save this otp in database
        const user = await User.findOneAndUpdate({ email }, { $set: { forgotPasswordOTP: otp, forgotPasswordExpiry: expiryDt } }, { runValidators: true, new: true });
        if (!user) {
            return res.status(401).json({ success: false, message: "Email is not registered", error: 'Unathorised request' })
        }

        const html = forgotPasswordTemplate({ name: user.name, otp });
        const { data, error } = await sendVerificationEmail(email, 'Reset your password', html)
        if (error) {
            console.log(error);
            return genericServerErr(res, error);
        }

        res.status(201).json({ success: true, message: "otp sent successfully to your email.", email, id: user._id.toString() })

    } catch (error) {
        genericServerErr(res, error)
    }
}

export default resendOTPController;