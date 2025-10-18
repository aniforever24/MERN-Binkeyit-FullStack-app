
import express from 'express'
import Category from '../models/database models/CategoryModel.js'
import upload from '../config/multerConfig.js'
import { accessTokenErrMW, multerErrMW } from '../middlewares/errorMW.js'
import uploadCategoryController from '../controllers/uploadCategoryController.js'
import getCategoriesController from '../controllers/getCategoriesController.js'
import editCategoryController from '../controllers/editCategoryController.js'
import deleteCategoryController from '../controllers/deleteCategoryController.js'
import { auth0MW } from '../middlewares/authMW.js'

const router = express.Router()

router.use(auth0MW)     // This middleware authenticates this route
router.use(accessTokenErrMW)    // handles access token error

router.get('/testing', (req, res) => {
    res.send('This auth category route is working 👍')
})

router.post('/upload', upload.single('image'), multerErrMW, uploadCategoryController)
router.put('/update', upload.single('image'), multerErrMW, editCategoryController)
router.delete('/delete', deleteCategoryController)

export default router;