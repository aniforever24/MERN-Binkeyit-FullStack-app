import User from "../models/database models/UserModel.js";
import { genericServerErr } from "../utlis/genericServerErr.js";


const verifyOTPController = async (req, res) => {
    try {
        const { otp, email } = req.body;
        if (!otp) {
            return res.status(400).json({ success: false, message: "otp is required", error: 'Empty otp' })
        }
        const user = await User.findOne({ email }).select('forgotPasswordOTP forgotPasswordExpiry')
        if (!user) {
            return res.status(403).json({ success: false, message: "Email does not match", error: 'Unathorised user' })
        }

        // if otp is not identical to db otp
        if (otp != user.forgotPasswordOTP) {
            return res.status(401).json({ success: false, message: 'Invalid otp', error: 'otp verification failed' })
        }

        // console.log('DB expiry date:--> ', new Date(user.forgotPasswordExpiry).toLocaleString('en-IN', {timeZone: 'Asia/Kolkata', timeZoneName: 'short'}));
        // console.log('current date:--> ', new Date().toLocaleString('en-IN', {timeZone: 'Asia/Kolkata', timeZoneName: 'short'}));

        // if otp expired
        const now = new Date();
        if (user.forgotPasswordExpiry < now) {
            return res.status(401).json({ success: false, message: 'otp expired', error: 'otp expired' })
        }
        // reset forgotPasswordOTP & forgotPasswordExpiry to default in database
        await User.updateOne({ email }, { $set: { forgotPasswordOTP: "", forgotPasswordExpiry: "" } })

        res.status(200).json({ success: true, message: "otp verified successfully" })
    } catch (error) {
        console.log(error)
        genericServerErr(res, error);
    }
}

export default verifyOTPController;