import Joi from "joi";

const updateUserDetailsSchema = Joi.object({
    name: Joi.string().trim().min(2),
    email: Joi.string().trim().lowercase().email({ minDomainSegments: 2 }),
    password: Joi.string().min(6),
    mobile: Joi.string()
            .pattern(/^\d{10}$/)
            .messages({
                'string.pattern.base': 'Phone number must be exactly 10 digits.'
            })
})

export default updateUserDetailsSchema