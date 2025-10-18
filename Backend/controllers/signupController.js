import bcrypt from 'bcrypt';
import { genericServerErr } from '../utlis/genericServerErr.js';
import sendVerificationEmail from '../config/verifiicationEmail.js';
import verifyEmailTemplate from '../utlis/verifyEmailTemplate.js';
import User from '../models/database models/UserModel.js';

const signupController = async (req, res) => {
    try {
        const { name, email, password, user } = req.body;

        // If user (from signupValidatorMW) is defined and user.emailVerified === false
        if (user && !user?.emailVerified) {
            const id = user._id.toString();
            const url = `${process.env.BACKEND_BASEURI}/api/user/verify-email/?token=${id}`
            const html = verifyEmailTemplate(name, url);    // get verification html

            // Resend verification email to user email
            const { data, error } = await sendVerificationEmail(email, "Verify your email", html)

            if (error) {
                console.log("Resend error -->", error)
                return res.status(504).json({ success: false, message: "Something goes wrong! Please try again.", error: "Verification email couldn't be send" })
            } else console.log("Resend data -->", data)

            return res.status(200).json({ success: true, message: `Verification email resend successfully. Please check your email.` })
        }

        // prepend pepper to the password to obtain new password
        const newPassword = process.env.PEPPER + password;
        // Encrypt new password
        const hashPassword = await bcrypt.hash(newPassword, 10);

        const newUser = new User({
            name,
            email,
            password: hashPassword,
        });

        let new_user;
        // save newUser to database
        try {
            new_user = await newUser.save();
        } catch (error) {
            console.log(error)
            return res.status(400).json({ success: false, error: error?.message || error, message: "client error" })
        }
        const id = new_user._id.toString();
        const url = `${process.env.BACKEND_BASEURI}/api/user/verify-email/?token=${id}`
        const html = verifyEmailTemplate(name, url);    // get verification html

        // Send verification email to user email
        const { data, error } = await sendVerificationEmail(email, "Verify your email", html)

        if (error) {
            console.log("Resend error -->", error)
        } else console.log("Resend data -->", data)

        return res.status(201).json({ success: true, message: `User sign up successfull!. Please check your email.` })
        
    } catch (error) {
        genericServerErr(res, error)
    }
}

export default signupController