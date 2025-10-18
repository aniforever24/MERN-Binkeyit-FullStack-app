import sendVerificationEmail from "../config/verifiicationEmail.js";
import User from "../models/database models/UserModel.js";
import forgotPasswordTemplate from "../utlis/forgotPasswordTemplate.js";
import { genericServerErr } from "../utlis/genericServerErr.js";
import { generateForgotPasswordOTP } from "../utlis/utilities.js";

const forgotPasswordController = async (req, res) => {
    try {
        const { email, name, id } = req.body;
        const otp = generateForgotPasswordOTP();
        const now = new Date();
        const expDuration = 30 * 60 * 1000  // milliseconds
        const expiryDt = new Date(now.getTime() + expDuration);
        // save this otp in database
        await User.updateOne({ email }, { forgotPasswordOTP: otp, forgotPasswordExpiry: expiryDt }, { runValidators: true });

        const html = forgotPasswordTemplate({ name, otp });
        const { data, error } = await sendVerificationEmail(email, 'Reset your password', html)
        if (error) {
            console.log(error);
            return genericServerErr(res, error);
        }

        res.status(200).json({ success: true, message: "otp sent successfully to your email.", email, id })

    } catch (error) {
        genericServerErr(res, error)
    }
}

export default forgotPasswordController;