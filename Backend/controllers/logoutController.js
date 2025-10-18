import { genericServerErr } from "../utlis/genericServerErr.js"
import { getLocalDateString, setCookieOptions } from "../utlis/utilities.js";
import User from "../models/database models/UserModel.js";

const logoutController = async (req, res) => {
    try {
        const id = req.id;

        // const result = await User.findById(id, ('refreshToken'))
        // const decode = jwt.verify(result.refreshToken, process.env.SECRET_KEY_REFRESH)
        // console.log(decode);
        // const tokenExp = getLocalDateString(decode.exp * 1000)

        // Clear client cookies and refresh token on db
        res.clearCookie('accessToken', setCookieOptions('none'))
        res.clearCookie('refreshToken', setCookieOptions('none'))
        const updateResult = await User.updateOne({ _id: id }, { refreshToken: "" }, { runValidators: true });

        res.status(200).json({ success: true, message: "You have successfully been logged out", updateResult })

    } catch (error) {
        genericServerErr(res, error)
    }
}

export default logoutController