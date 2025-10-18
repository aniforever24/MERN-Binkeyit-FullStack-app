
const verifyEmailTemplate = (userName, url) => {
    return (
        `<div
        style="background-color: rgb(184, 149, 250); height: 500px; font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif; padding: 0 1rem;">
        <div style="max-width: 60%; margin: 0 auto; padding-top: 4rem;">
            <h1 style="font-family: Verdana, Geneva, Tahoma, sans-serif; padding: 2rem 0; ">Confirm Your Account
            </h1>
            <div style="text-align: left; padding: 0 0 2rem 0;">
                <p style="font-size: 18px; max-width: 35rem;">Dear <strong style="font-weight: 800;">${userName}</strong>,
                    Thank you for signing up for Binkeyit. To confirm your account, please click the button below.
                </p>
            </div>
            <a href=${url} target="_blank"
                style="display: block; text-align: center; padding: 15px 60px; font-size: 14px; font-weight: 600; border-radius: 10px; border: 0.5px solid black; outline: none; cursor: pointer; text-decoration: none; color: inherit; background-color: aliceblue; max-width: 150px;">Confirm
                Account</a>
            <div style="padding: 3rem 0 1rem 0; font-weight: 800;">Team Blinkeyit | Binkeyit.com</div>`
    )
}

export default verifyEmailTemplate;