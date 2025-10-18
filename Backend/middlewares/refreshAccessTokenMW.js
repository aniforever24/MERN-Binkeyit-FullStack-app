import jwt from 'jsonwebtoken'
import User from '../models/database models/UserModel.js'

export default async function refreshAccessTokenMW(req, res, next) {
    const refreshToken = req?.cookies?.refreshToken || req.body?.token
    if (!refreshToken) {
        return res.status(403).json({ success: false, message: "token missing, please log out and then log in again or clear your cookies.", error: 'refresh token missing' })
    }
    try {
        const decode = jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH)
        const user = await User.findById(decode.id)
      
        req.data = { refreshToken, user }

        next()
    } catch (error) {
        console.log(error);
        next(error)
    }
}