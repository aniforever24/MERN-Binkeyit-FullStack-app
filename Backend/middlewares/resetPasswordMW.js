import Joi from "joi";
import User from "../models/database models/UserModel.js";
Joi
import { genericServerErr } from "../utlis/genericServerErr.js";

const resetPasswordMW = async (req, res, next) => {
    try {
        const { id, password, confPassword } = req.body
        if (!id) {
            return res.status(401).json({ message: "Unauthorised request", error: "Empty or null id" })
        }
        // test if user with id exists in db
        let user;
        try {
            user = await User.findById(id, ('name email password'))
        } catch (error) {
            return res.status(401).json({ message: 'Invalid id', error: error.message || error })
        }
        if (!user) {
            return res.status(401).json({ success: false, message: "Unauthorised request", error: "Wrong user id" })
        }
        // validation
        const schema = Joi.object({
            password: Joi.string().required().min(6),
            confPassword: Joi.valid(Joi.ref('password')).required()
                .messages({
                    'any.only': "Confirm Password mismatch with Password",
                    'any.required': "Confirm Password is required"
                })
        }).with('password', 'confPassword');

        const { value, error } = schema.validate({ password, confPassword });
        if (error) {
            return res.status(400).json({ success: false, message: "Validation error", error: error?.message || error })
        }
        req.body.user = user
        next()
    } catch (error) {
        genericServerErr(res, error)
    }
}

export default resetPasswordMW;