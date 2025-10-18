import jwt from "jsonwebtoken";
import User from "../models/database models/UserModel.js";
import { generateAccesssToken } from "../utlis/generateTokens.js";
import { setCookieOptions } from "../utlis/utilities.js";

// error handling middleware fn for access token error
export async function accessTokenErrMW(err, req, res, next) {
    console.log(err.name)
    if (err.name === "TokenExpiredError") {
        return res.status(401).json({ success: false, message: 'Access token expired', error: err.name })
    }
    return res.status(403).json({ success: false, message: 'Unauthorised request', error: err?.message || err })
}

// error handling middleware fn for refresh token error
export async function refreshTokenErrMW(err, req, res, next) {
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ success: false, message: "Refresh token expired, please log in again", error: err?.message || err })
    } else if (err.name === 'JsonWebTokenError') {
        return res.status(403).json({ success: false, message: "Unauthorised request", error: err?.message || err })
    } else if (err.name === 'NotBeforeError') {
        const d = new Date(err?.date).toString()
        return res.status(402).json({ success: false, message: `token will be valid on ${d}`, error: err?.message || err })
    }
    return res.status(500).json({ success: false, message: 'Internal server error', error: err?.message || err })
}

// error handling middleware for handling multer error
export async function multerErrMW(err, req, res, next) {
    return res.status(400).json({ success: false, message: 'Fail to upload file', error: err?.message || err })
}