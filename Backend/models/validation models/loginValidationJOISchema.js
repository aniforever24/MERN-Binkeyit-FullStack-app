import Joi from "joi";

const loginSchema = Joi.object({
    email: Joi.string().required()
        .email({ minDomainSegments: 2 }),
    password: Joi.string().required().min(6),
});

export default loginSchema;