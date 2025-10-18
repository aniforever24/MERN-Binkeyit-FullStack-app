import jwt from 'jsonwebtoken'

export const generateRefreshToken = (user, t = "7d") => {
    let payload = {
        id: user?._id.toString(),
        type: "refresh"
    }
    return jwt.sign(payload, process.env.SECRET_KEY_REFRESH, { expiresIn: t })
}

export const generateAccesssToken = (user, t = "30m") => {
    const payload = {
        id: user?._id.toString(),
        name: user?.name,
        email: user?.email,
        role: user?.role,
        type: "access"
    }

    return jwt.sign(payload, process.env.SECRET_KEY_ACCESS, { expiresIn: t })
}

