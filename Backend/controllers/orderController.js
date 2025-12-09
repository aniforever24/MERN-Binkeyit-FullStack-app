import Order from "../models/database models/OrderModel.js"
import User from "../models/database models/UserModel.js"
import { genericServerErr } from "../utlis/genericServerErr.js"

export const cashPaymentController = async (req, res) => {
    try {
        const { id: userId, paymentMode } = req;
        const { products, productDetails, deliveryAddress, subTotalAmt, totalAmt } = req.body

        if (!products || !productDetails || !deliveryAddress || !subTotalAmt || !totalAmt) {
            res.status(400).json({
                success: false,
                error: "One or more order details is/are not available!"
            })
        }

        const paymentStatus = "pending";
        const deliveryStatus = "pending";

        const payload = { userId, products, productDetails, paymentMode, paymentStatus, deliveryAddress, deliveryStatus, subTotalAmt, totalAmt }

        const order = new Order(payload);
        let newOrder = await order.save();
        newOrder = await Order.findById(newOrder._id).populate(
            [
                {
                    path: "userId",
                    select: "name email mobile"
                },
                {
                    path: "products",
                    populate: [
                        { path: "categories", select: "-__v -updatedAt -createdAt" },
                        { path: "subCategories", select: "-__v -updatedAt -createdAt" },
                    ],
                    select: "-__v -updatedAt -createdAt"
                },
                {
                    path: "productDetails",
                    select: "-__v -updatedAt -createdAt"
                },
            ]).lean()

        // Update user db document with new order
        const updateResult = await User.updateOne({ _id: userId }, { $push: { orderHistory: newOrder._id } })

        res.status(201).json({
            success: true,
            message: "New order created successfully.",
            data: newOrder
        })

    } catch (error) {
        genericServerErr(res, error)
    }
}

export const onlinePaymentController = async (req, res) => {
    try {
        res.send("online payment working")
    } catch (error) {
        genericServerErr(res, error)
    }
}