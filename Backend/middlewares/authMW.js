import { genericServerErr } from "../utlis/genericServerErr.js";
import jwt from 'jsonwebtoken';
import { getLocalDateString, setCookieOptions } from "../utlis/utilities.js";

export const auth0MW = async (req, res, next) => {
    try {
        const accessToken = req?.cookies?.accessToken || req.headers?.authorization?.split(' ')[1]

        if (!accessToken) {
            res.clearCookie('accessToken', setCookieOptions('none'))
            res.clearCookie('refreshToken', setCookieOptions('none'))
            return res.status(403).json({
                success: false,
                message: 'token missing',
                error: 'access token missing'
            })
        }
        let decode;
        try {
            decode = jwt.verify(accessToken, process.env.SECRET_KEY_ACCESS)
            req.id = decode.id;
        } catch (error) {
            console.log('access token not verified or expired', error?.message);
            return next(error)
        }
        const accessExpiry = getLocalDateString(decode.exp * 1000)
        req.accessTokenExpiry = accessExpiry;
        req.accessToken = accessToken;
        console.log('access token verified');

        next()
    } catch (error) {
        genericServerErr(res, error)
    }
}

