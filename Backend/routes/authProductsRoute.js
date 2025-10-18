// Router handling authenticated Product requests

import express from 'express'
import { Router } from 'express'
import { auth0MW } from '../middlewares/authMW.js'
import { accessTokenErrMW } from '../middlewares/errorMW.js'
import {uploadMany} from '../config/multerConfig.js'
import uploadProductsController from '../controllers/uploadProductsController.js'
import updateProductsController from '../controllers/updateProductsController.js'

const router = Router()

router.use(auth0MW)
router.use(accessTokenErrMW)    

router.get('/testing', (req, res)=> {
    res.send('Products router is 100% working 🙂👍')
})

router.post('/upload', uploadMany.array('images') ,uploadProductsController)
router.put('/update', uploadMany.array('images'), updateProductsController)

export default router