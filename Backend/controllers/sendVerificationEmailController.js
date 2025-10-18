import { genericServerErr } from "../utlis/genericServerErr.js"
import resendVerificationEmail from "../config/verifiicationEmail.js"
import verifyEmailTemplate from "../utlis/verifyEmailTemplate.js"
import User from "../models/database models/UserModel.js"

const sendVerificationEmailController = async (req, res) => {
    try {
        const id = req.id
        const user = await User.findById(id).select('name email')

        const url = `${process.env.BACKEND_BASEURI}/api/user/verify-email/?token=${id}`
        const html = verifyEmailTemplate(user.name, url)
        const { data, error } = await resendVerificationEmail(user.email, 'Verify your email', html)
        if (error) {
            console.log(error);
            return genericServerErr(res, error);
        }

        return res.status(200).json({ success: true, message: 'Verification email send successfully' })
    } catch (error) {
        return genericServerErr(res, error)
    }
}

export default sendVerificationEmailController