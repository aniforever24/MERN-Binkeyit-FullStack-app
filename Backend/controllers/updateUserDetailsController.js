import User from "../models/database models/UserModel.js";
// import { updateDocs } from "../utlis/allDBdocsUpdateScript.js";
import { genericServerErr } from "../utlis/genericServerErr.js";
import bcrypt from 'bcrypt'

const updateUserDetailsController = async (req, res) => {
    try {
        let { name, email, password, mobile } = req.body
        let id = req.id;

        let newPassword, hashPassword;
        if (password) {
            newPassword = process.env.PEPPER + password;
            hashPassword = await bcrypt.hash(newPassword, 10);

        }

        let dbEmail;
        if (email) {
            const { email } = await User.findById(id, 'email');
            dbEmail = email;
        }

        // await updateDocs('mobileOTP', "");   // One time update for persisting new schema changes to all docs in db

        // update database with user input values
        const updateResult = await User.updateOne({ _id: id }, {
            ...(name && { name }),
            ...(email && (email !== dbEmail) && { email, emailVerified: false }),
            ...(mobile && { mobile }),
            ...(password && { password: hashPassword }),
        }, { runValidators: true });

        res.status(201).json({ success: true, message: 'New details updated successfully', ...(email && { warning: "Please verify your updated email" }) })

    } catch (error) {
        console.log(error);
        genericServerErr(res, error)
    }
}

export default updateUserDetailsController