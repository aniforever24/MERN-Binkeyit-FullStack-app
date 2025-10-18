import User from "../models/database models/UserModel.js";

const verifyEmailController = async (req, res) => {
    
    const id = req.query.token;
    let user;
    const data = {
        url: `${process.env.FRONTEND_BASEURI}/user/login/?token=${id}&emailVerified=true`,
        heading: "Your email has been verified successfully!"
    }

    try {
        user = await User.findById(id)
    } catch (error) {
        console.log(error?.message || error)
        return res.status(404).send('User does not exist')
    }
    if (!user) return res.status(404).send('User does not exist');
    if (user?.emailVerified) {
        data.heading = "Your email is already verified!"
        return res.render('emailVerified', data)
    }
    // update email verification status in database
    try {
        const result = await User.updateOne({ _id: id }, { $set: { status:"Active", emailVerified: true } }, { runValidators: true })
        // console.log(result);
    } catch (error) {
        console.log(error);
        return 
    }

    res.render('emailVerified', data)
}

export default verifyEmailController