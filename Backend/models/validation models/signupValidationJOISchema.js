import Joi from "joi";

const signupSchema = Joi.object({
    name: Joi.string().trim().min(2).required(),
    email: Joi.string().trim().lowercase().required()
        .email({ minDomainSegments: 2 }),
    password: Joi.string().required().min(6),
    confPassword: Joi.required()
    .valid(Joi.ref('password'))
    .messages({
        "any.only": "Password mismatch with confirm password",
        "any.required": "Confirm password cannot be empty"
    })
}).with('password', 'confPassword');

export default signupSchema;