
const forgotPasswordTemplate = ({name, otp}) => {
    return `<div style="height: 500px; font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif; padding: 0 1rem;">
        <div style="max-width: 60%; margin: 0 auto; padding-top: 4rem;">
            <h1 style="font-family: Verdana, Geneva, Tahoma, sans-serif; padding: 2rem 0; ">OTP For Resetting Password </h1>
            <div style="text-align: left; padding: 0 0 2rem 0;">
                <p style="font-size: 18px; max-width: 35rem; text-align: justify;">Dear <strong style="font-weight: 800;">${name}</strong>,
                    It seems that you have forgotten your password and trying to recover your account by reseting you password. Use the 6 digit otp below to reset your password.
                </p>
            </div>
            <div style="display: block; text-align: center; padding: 15px 60px; font-size: 30px; font-weight: 600; border-radius: 10px; border: 0.5px solid black; outline: none; cursor: copy; user-select: all; text-decoration: none; color: inherit; background-color: yellow; max-width: 30rem;">${otp}</div>
                <p style="color: red;"><strong>*</strong> If this email is not inteded to you, please ignore this email and delete it. Thank you for undestanding.</p>
            <p style="padding: 3rem 0 1rem 0; font-weight: 800;">Team Blinkeyit | Binkeyit.com</p>
        </div>
    </div>`
}

export default forgotPasswordTemplate;