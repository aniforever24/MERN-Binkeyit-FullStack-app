
export const setCookieOptions = (max_age = 30) => {
    if (max_age == 'none' || max_age == 0) {
        max_age = undefined;
    }
    let same_site = 'none'
    if (!(process.env.NODE_ENV === "PRODUCTION")) {
        same_site = ""
    }
    return {
        httpOnly: true,
        secure: process.env.NODE_ENV === "PRODUCTION",
        sameSite: same_site,
        maxAge: (max_age && max_age * 60 * 1000)  // max_age is in minutes
    }
}

// generates 6 digit random otp string
export const generateForgotPasswordOTP = () => {
    let r = Math.floor(1_00_000 + Math.random() * 9_00_000).toString();
    return r
}
// for(let i=0, j=100; i < j; i++) {
//     console.log(generateForgotPasswordOTP());
// }

export const getLocalDateString = (dateString) => {
    try {
        const inputDt = new Date(dateString);
        const localDtStr = inputDt.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', timeZoneName: "short" })
        return localDtStr;
    } catch (error) {
        console.log(error)
    }
}

// Extract cloudinary public id of the realted asset from image url
export const getCloudinaryPublicId = (url) => {
    let i = url.lastIndexOf('.')
    let str = url.slice(0, i)
    i = str.indexOf('/upload/')
    str = str.slice(i + ('/upload/'.length),)
    i = str.indexOf('/')
    str = str.slice(i + 1,)
    const publicId = decodeURI(str)
    
    return publicId
}
