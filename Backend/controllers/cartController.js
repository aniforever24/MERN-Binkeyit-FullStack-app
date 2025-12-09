import CartProduct from "../models/database models/CartProductsModel.js"
import User from "../models/database models/UserModel.js"
import { genericServerErr } from "../utlis/genericServerErr.js"

export const addToCartController = async (req, res) => {
    try {
        const userId = req.id
        const { productId } = req.body

        if (!productId) {
            return res.status(400).json({ success: false, message: "Product id required", error: "No Product id received" })
        }


        // Check if product already exists in the cart
        const checkCartExists = await CartProduct.findOne({
            user: userId,
            product: productId
        })

        if (checkCartExists) {
            return res.status(400).json({ success: false, message: "Item already exists in your cart", error: "Item already exists in your cart" })
        }

        const newCartItem = new CartProduct({
            product: productId,
            user: userId,
            quantity: 1
        })
        const saved = (await (await newCartItem.save()).populate('product'))

        const userUpdateResult = await User.updateOne({ _id: userId }, { $addToSet: { shoppingCart: saved } })

        return res.status(201).json({
            success: true,
            message: "Item added successfully.",
            data: saved,
        })
    } catch (error) {
        console.log('error in addToCartController: ', error)
        genericServerErr(res, error)
    }
}

export const getCartItemsController = async (req, res) => {
    try {
        const userId = req.id
        const [cartItems, quantity] = await Promise.all([CartProduct.find({ user: userId }).populate('product'),
        CartProduct.countDocuments()])
        return res.status(200).json({
            success: true,
            message: quantity > 0 ? "Cart items succesfully fetched." : "No items in your cart!",
            data: { cartItems, cartItemsNum: quantity }
        })
    } catch (error) {
        console.log('Error from getCartItemsController: ', error)
        genericServerErr(res, error)
    }
}

export const updateCartItemController = async (req, res) => {
    try {
        const { id, quantity } = req.body

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "cart id is required",
                error: "No cart id received!"
            })
        }
        if (quantity && quantity < 0) {
            return res.status(400).json({
                success: false,
                message: "quantity can not be negative!",
                error: "Wrong quanity (< 0)"
            })
        }
        if (!quantity) {
            return res.status(400).json({
                success: false,
                message: "quantity can not be zero or null",
                error: "Received quantity 0 or null"
            })
        }

        // Update quantity of cart item with cartId
        const update = await CartProduct.updateOne({ _id: id }, {
            ...(quantity > 0 && { quantity })
        })

        res.status(200).json({
            success: true,
            message: "Cart quantity updated successfully",
            data: update
        })

    } catch (error) {
        console.log('Error from cart update:', error)
        genericServerErr(res, error)
    }
}

export const deleteCartItemController = async (req, res) => {
    try {
        const userId = req.id
        const { id } = req.body
        // console.log('delet cart --  id:', id)

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "No cart id received to delete",
                error: "Failed to delete"
            })
        }

        const del = await CartProduct.deleteOne({ _id: id })

        const userUpdateResult = await User.updateOne({ _id: userId }, { $pull: { shoppingCart: id } })

        res.status(200).json({
            success: true,
            message: "Item successfully removed from your cart",
            data: del
        })

    } catch (error) {
        // console.log('Error from delete cart:', error)
        genericServerErr(res, error)
    }
}

export const emptyCartController = async (req, res) => {
    try {
        const userId = req.id;
        const { id: user_id } = req.body;  // user id from client to ensure sensitive operation

        if (userId !== user_id) {
            return res.status(400).json({
                success: false,
                error: "User id does not match",
                message: "User id does not match",
            })
        };

        const query = { user: userId };

        const toBeDeleted = await CartProduct.find(query);
        const result = await CartProduct.deleteMany(query);

        return res.status(200).json({
            success: true,
            message: "Cart emptied successfully",
            data: { deletedCartItems: toBeDeleted, deletedResult: result }
        });

    } catch (error) {
        genericServerErr(res, error);
    }
}