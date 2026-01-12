import Stripe from "../config/stripe.js"
import Order from "../models/database models/OrderModel.js"
import User from "../models/database models/UserModel.js"
import { genericServerErr } from "../utlis/genericServerErr.js"
import fs from 'fs/promises'
import { calculateDiscountedPrice } from "../utlis/utilities.js"
import Address from "../models/database models/AddressModel.js"
import Product from "../models/database models/ProductModel.js"
import CartProduct from "../models/database models/CartProductsModel.js"

export const getOrdersController = async (req, res) => {
    try {
        const userId = req.id;
        const { page = 1, limit = 10 } = req.body;

        let skip = (page - 1) * limit;

        const orders = await Order.find({ userId }).limit(limit).skip(skip)
        const countOfOrders = await Order.find({ userId }).countDocuments();

        if (!orders) {
            return res.status(204).json({
                success: true,
                message: "No orders found!",
                data: { orders, countOfOrders }
            })
        }

        return res.status(200).json({
            success: true,
            message: "Orders fetched successfuly",
            data: { orders, countOfOrders, pagination: {page, limit} }
        })

    } catch (error) {
        return genericServerErr(res, error)
    }
}

export const cashPaymentController = async (req, res) => {
    try {
        const { id: userId, paymentMode } = req;
        let { productIds, cartItemsIds, deliveryAddress, subTotalAmt, totalAmt } = req.body

        if (!productIds || !cartItemsIds || !deliveryAddress || !subTotalAmt || !totalAmt) {
            return res.status(400).json({
                success: false,
                error: "One or more order details is/are not available!",
                message: "One or more order details is/are not available!",
            })
        }

        deliveryAddress = await Address.findById(deliveryAddress._id);

        if (!deliveryAddress) {
            return res.status(400).json({
                success: false,
                error: "Delivery address not found in database",
                message: "Invalid delivery address!"
            })
        };

        let products = await Promise.all(productIds.map((prodId) => Product.findById(prodId).populate('categories').populate('subCategories').lean()));

        let cartItems = await Promise.all(cartItemsIds.map(cartId => {
            return (
                CartProduct.findById(cartId).populate([
                    {
                        path: 'product',
                        populate: [
                            { path: 'categories' },
                            { path: 'subCategories' },
                        ]
                    },
                ]).lean()
            )
        }
        ));

        const orderProducts = products.map(prod => {
            return {
                productId: prod._id,
                snapshot: productSnapshot(prod)
            }
        })
        const orderCartItems = cartItems.map(item => {
            return {
                cartId: item._id,
                product: {
                    productId: item.product._id,
                    snapshot: productSnapshot(item.product)
                },
                quantity: item.quantity
            }
        })

        const paymentStatus = "pending";
        const deliveryStatus = "pending";


        const payload = {
            userId,
            products: orderProducts,
            productDetails: orderCartItems,
            paymentMode,
            paymentStatus,
            deliveryAddress: {
                addressId: deliveryAddress._id,
                snapshot: {
                    addressLine: deliveryAddress.addressLine,
                    city: deliveryAddress.city,
                    pincode: deliveryAddress.pincode,
                    mobile: deliveryAddress?.mobile,
                    state: deliveryAddress?.state,
                    country: deliveryAddress?.country
                }
            },
            deliveryStatus,
            subTotalAmt: Number(subTotalAmt.toFixed(2)),
            totalAmt: Number(totalAmt.toFixed(2))
        }

        const order = new Order(payload);
        let newOrder = await order.save();
        newOrder = await Order.findById(newOrder._id).populate(
            [
                {
                    path: "userId",
                    select: "name email mobile"
                }
            ]).lean()

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

export const webhookEndpointController = async (req, res) => {

    const endpointSecret = process.env.STRIPE_WEBHOOK_ENDPOINT_SECRET;

    let event = req.body;

    // console.log('event:', event)

    if (endpointSecret) {
        const signature = req.headers['stripe-signature'];

        try {
            event = Stripe.webhooks.constructEvent(
                req.body,
                signature,
                endpointSecret
            );
        } catch (err) {
            console.log('⚠ Webhook signature verification failed.', err.message)
            return res.status(400).json({
                sussess: false,
                error: '⚠ Webhook signature verification failed.',
                message: '⚠ Webhook signature verification failed.'
            })
        }
    }

    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;

            // Get line items defined in sessions object in onlinePayment endpoint
            const line_items = await Stripe.checkout.sessions.listLineItems(session.id)

            const deliveryAddress = await Address.findById(session.metadata.shipping_address)


            const productIds = line_items.data.map((item) => item.metadata.productId);
            const cartItemsIds = line_items.data.map((item) => item.metadata.cartId);

            let products = await Promise.all(productIds.map((prodId) => Product.findById(prodId).populate('categories').populate('subCategories').lean()));
            let cartItems = await Promise.all(cartItemsIds.map(cartId => {
                return (
                    CartProduct.findById(cartId).populate([
                        {
                            path: 'product',
                            populate: [
                                { path: 'categories' },
                                { path: 'subCategories' },
                            ]
                        },
                    ]).lean()
                )
            }
            ));

            const orderProducts = products.map(prod => {
                return {
                    productId: prod._id,
                    snapshot: productSnapshot(prod)
                }
            })
            const orderCartItems = cartItems.map(item => {
                return {
                    cartId: item._id,
                    product: {
                        productId: item.product._id,
                        snapshot: productSnapshot(item.product)
                    },
                    quantity: item.quantity
                }
            })

            // Create payload for Order 
            const payload = {
                userId: session.client_reference_id,
                products: orderProducts,
                productDetails: orderCartItems,
                paymentId: session.payment_intent,
                sessionId: session.id,
                paymentStatus: "paid",
                paymentMode: "ONLINE",
                deliveryStatus: "pending",
                deliveryAddress: {
                    addressId: deliveryAddress._id,
                    snapshot: {
                        addressLine: deliveryAddress.addressLine,
                        city: deliveryAddress.city,
                        pincode: deliveryAddress.pincode,
                        mobile: deliveryAddress?.mobile,
                        state: deliveryAddress?.state,
                        country: deliveryAddress?.country
                    }
                },
                subTotalAmt: session.amount_subtotal / 100,
                totalAmt: session.amount_total / 100,
                invoiceReceipt: session.invoice,
            }

            // Save new order in db
            const newOrder = await (new Order(payload)).save()
            // console.log('newOrder:-->', newOrder)

            // Update User with new order in db
            const updateResult = await User.updateOne({ _id: session.client_reference_id }, {
                $addToSet: {
                    orderHistory: newOrder._id
                }
            })

            break;

        default:
            // Unexpected event type
            console.log(`Unhandled event type ${event.type}`)
    }
    return res.status(200).json({ message: "Payment successfull." })
}

export const onlinePaymentController = async (req, res) => {
    try {
        const { id: userId, paymentMode } = req;
        const { cartItems, deliveryAddress, fixedOtherChargesValue, subTotalAmt } = req.body;

        const user = await User.findById(userId, "name email mobile emailVerified status role mobileVerified").lean()

        let isShippingChargesApplicable = false;
        if (subTotalAmt < 500) {
            isShippingChargesApplicable = true
        };

        const payload = {
            client_reference_id: userId,
            line_items: cartItems.map((item, i) => {
                let discountedPrice = calculateDiscountedPrice(item.product.price, item.product?.discount || 0)

                discountedPrice = (discountedPrice * 100).toFixed(2)

                return {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: item.product.name,
                            images: item.product.images.map((obj) => obj?.url),
                            unit_label: item.product?.unit,
                        },
                        tax_behavior: "inclusive",
                        unit_amount_decimal: discountedPrice,
                    },
                    metadata: {
                        productId: item.product?._id,
                        cartId: item._id
                    },
                    quantity: item.quantity,
                    adjustable_quantity: {
                        enabled: true,
                        minimum: 1
                    }
                }
            }),
            customer_email: user?.email,
            mode: "payment",

            success_url: `${process.env.FRONTEND_BASEURI}/new-order/success/{CHECKOUT_SESSION_ID}?status=paid&source=stripe`,
            cancel_url: `${process.env.FRONTEND_BASEURI}/new-order/cancelled`,
            currency: "inr",
            payment_method_types: ['card'],
            invoice_creation: {
                enabled: true,
            },
            metadata: {
                shipping_address: deliveryAddress?._id.toString(),
            },
            shipping_options: [
                {
                    shipping_rate_data: {
                        display_name: "Extra Charges",
                        fixed_amount: {
                            amount: (isShippingChargesApplicable ? fixedOtherChargesValue * 100 : 0),
                            currency: "inr",
                        },
                        metadata: {
                            deliveryCharges: 25,
                            handlingCharges: 10,
                            plateformFees: 5,
                        },
                        type: "fixed_amount"
                    }
                },
            ],
        }

        const session = await Stripe.checkout.sessions.create(payload)
        // console.log('session: ', session)

        return res.status(200).json({
            success: true,
            data: { payment_url: session?.url, sessionId: session?.id }
        })

    } catch (error) {
        genericServerErr(res, error)
    }
}

export const confirmOnlinePaymentController = async (req, res) => {
    try {
        const { sessionId } = req.body
        const order = await Order.findOne({ sessionId }).lean()

        if (!order) {
            return res.status(404).json({
                success: false,
                error: "Couldn't find order",
                message: "This order does not exist in our system! Please conatct site administrator."
            })
        }

        if (order.paymentStatus === "paid") {
            return res.status(200).json({
                success: true,
                message: "Payment confirmed succesfully",
                data: { order }
            })
        }

        return res.status(402).json({
            success: false,
            error: "Payment not done",
            messaage: "Payment confirmation failed!"
        })

    } catch (error) {
        return genericServerErr(res, error)
    }
}

// General functions
function productSnapshot(product) {
    return {
        name: product.name,
        images: product?.images.map((imgObj => imgObj.url)),
        unit: product.unit,
        price: product.price,
        discount: product?.discount || 0,
        categories: product?.categories.map(cat => cat?.name),
        subCategories: product?.subCategories.map(subcat => subcat?.name),
        stock: product?.stock,
        description: product?.description,
        moreDetails: product?.moreDetails
    }
}