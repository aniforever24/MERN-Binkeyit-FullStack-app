import User from "../models/database models/UserModel.js";
import { genericServerErr } from "../utlis/genericServerErr.js";

export default async function userDetailsController(req, res) {
    try {
        const { id, accessToken } = req;
        let { shoppingCartPopulate } = req.body

        if(shoppingCartPopulate) {
           shoppingCartPopulate = "shoppingCart"
        } else {
            shoppingCartPopulate = ""
        }


        const user = await User.findById(id, ('-password -mobileOTP -refreshToken -forgotPasswordOTP -forgotPasswordExpiry'))
                                .populate(shoppingCartPopulate)

        // check if client side local storage contains accessToken
        let access_Token;
        if (!req.headers?.authorization?.split(' ')[1]) {
            access_Token = accessToken;
        }


        return res.status(200).json({ success: true, message: 'User details successfully fetched', data: { user, accessToken: access_Token } })
    } catch (error) {
        genericServerErr(res, error)
    }
}