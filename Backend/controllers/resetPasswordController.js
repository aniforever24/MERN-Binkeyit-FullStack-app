import User from "../models/database models/UserModel.js";
import { genericServerErr } from "../utlis/genericServerErr.js";
import bcrypt from 'bcrypt'
import { getLocalDateString } from "../utlis/utilities.js";

const resetPasswordController = async (req, res) => {
    try {
        const { user, password } = req.body;

        const pepper = process.env.PEPPER;
        const newPassword = pepper + password;

        const hashPassword = await bcrypt.hash(newPassword, 10)
        const result = await User.updateOne({ email: user.email }, { $set: { password: hashPassword } })

        // const {updatedAt} = await User.findOne({email: user.email})
        // const local_updatedAt = getLocalDateString(updatedAt)
        // console.log(local_updatedAt)

        res.status(201).json({ success: true, message: "Password reset successfully" })
    } catch (error) {
        genericServerErr(res, error)
    }
}

export default resetPasswordController;