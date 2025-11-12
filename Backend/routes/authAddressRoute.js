import {Router} from 'express'
import { auth0MW } from '../middlewares/authMW.js'
import { accessTokenErrMW } from '../middlewares/errorMW.js'
import { getAddressController } from '../controllers/addressController.js'

const router = Router()

router.use(auth0MW)
router.use(accessTokenErrMW)

router.get('/get', getAddressController)

export default router