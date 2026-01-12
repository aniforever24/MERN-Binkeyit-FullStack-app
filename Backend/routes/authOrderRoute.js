import { Router } from 'express'
import { auth0MW } from '../middlewares/authMW.js'
import { accessTokenErrMW } from '../middlewares/errorMW.js'
import { cashPaymentController, confirmOnlinePaymentController, getOrdersController, onlinePaymentController } from '../controllers/orderController.js'

const router = Router()

// Authenticate this router
router.use(auth0MW)
router.use(accessTokenErrMW)

router.get('/test', (req, res) => {
    res.send("authOrderRouter working successfully 👍")
})

router.post('/new-order/payment', async (req, res) => {
    let { paymentMode } = req.body
    
    if (!paymentMode || !["COD", "ONLINE"].includes(paymentMode.toUpperCase())) {
        return res.status(400).json({
            success: false,
            error: 'No paymentMode received!',
            message: "Payment mode is required whether \"COD\" or \"ONLINE\""
        })
    }

    paymentMode = paymentMode.toUpperCase()
    req.paymentMode = paymentMode

    if (paymentMode === "COD") {
        return await cashPaymentController(req, res)
    } else if (paymentMode === "ONLINE") {
        return await onlinePaymentController(req, res)
    }
})
router.post('/new-order/payment/confirmation', confirmOnlinePaymentController)
router.post('/get-orders', getOrdersController)

export default router