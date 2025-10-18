import { genericServerErr } from '../utlis/genericServerErr.js'
import { generateAccesssToken } from '../utlis/generateTokens.js'
import { setCookieOptions } from '../utlis/utilities.js'

const refreshAccessTokenController = async (req, res) => {
    try {
        const { user, refreshToken } = req.data
        const newAccessToken = generateAccesssToken(user)   // generate new access token

        // set new access token into cookie
        res.cookie('accessToken', newAccessToken, setCookieOptions(30))
        req.accessTokenExpiry = new Date(Date.now() + 30 * 60 * 1000);

        res.status(200).json({ success: true, message: "New access token generated", data: { accessToken: newAccessToken, refreshToken, accessTokenExpiry: req.accessTokenExpiry } })

    } catch (error) {
        console.log(error);
        return genericServerErr(error)
    }
}

export default refreshAccessTokenController
