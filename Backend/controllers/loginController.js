import bcrypt from 'bcrypt'
import { genericServerErr } from '../utlis/genericServerErr.js'
import User from '../models/database models/UserModel.js'
import { setCookieOptions } from '../utlis/utilities.js'
import { generateAccesssToken, generateRefreshToken } from '../utlis/generateTokens.js'
import runOnceCartSync from '../utlis/runOnceScript.js'



const loginController = async (req, res) => {
    try {
        const { email, password, user } = req.body
        const hashPassword = user.password

        const newPassword = process.env.PEPPER + password;

        const result = await bcrypt.compare(newPassword, hashPassword)
        if (!result) {
            return res.status(403).json({ success: false, message: "Invalid password", error: "Invalid password" })
        }
        // Refresh token
        const refreshToken = generateRefreshToken(user);
        // login date
        const now = new Date()

        // update database with new refresh token and get updated user details
        const updatedUser = await User.findByIdAndUpdate(user._id, { $set: { refreshToken: refreshToken, last_login_date: now } }, { runValidators: true, new: true }
        ).select('-password -mobileOTP -refreshToken -forgotPasswordOTP -forgotPasswordExpiry');

        // Access token
        const accessToken = generateAccesssToken(user);

        // Set and send access token and refresh token securely with http cookies
        res.cookie('refreshToken', refreshToken, setCookieOptions(7 * 24 * 60));
        res.cookie('accessToken', accessToken, setCookieOptions(30));

        res.json({ success: true, message: "Login successful!", data: { refreshToken, accessToken, user: updatedUser } })

        runOnceCartSync(user._id);

    } catch (error) {
        console.log(error);
        genericServerErr(res, error)
    }
}

export default loginController;