import {Router} from 'express'
import { auth0MW } from '../middlewares/authMW.js'
import { accessTokenErrMW } from '../middlewares/errorMW.js'
import { addAddressController, deleteAddressController, getAddressController } from '../controllers/addressController.js'

const router = Router()

router.use(auth0MW)
router.use(accessTokenErrMW)

router.get('/get', getAddressController)
router.post('/add', addAddressController)
router.delete('/delete',deleteAddressController)

export default router