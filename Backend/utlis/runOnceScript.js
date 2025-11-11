import CartProduct from '../models/database models/CartProductsModel.js'
import User from '../models/database models/UserModel.js'

export default async function runOnceCartSync(userId) {
    try {
        const { runOnce } = await User.findById(userId, 'runOnce')

        if(!runOnce) {
            const cartItems = await CartProduct.find({user: userId})
            const userUpdateResult = await User.updateOne({_id: userId}, { $set: { shoppingCart: cartItems , runOnce: true } })
        }
    } catch (err) {
        console.error('runOnceCartSync failed:', err);
    }
}