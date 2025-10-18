import { Router } from 'express'
import { addToCartController, deleteCartItemController, getCartItemsController, updateCartItemController } from '../controllers/cartController.js'
import { auth0MW } from '../middlewares/authMW.js'
import { accessTokenErrMW } from '../middlewares/errorMW.js'

const router = Router()

router.use(auth0MW)
router.use(accessTokenErrMW)

router.post("/create", addToCartController)
router.get('/get', getCartItemsController)
router.put('/update', updateCartItemController)
router.delete('/delete', deleteCartItemController)

export default router