import express from 'express'
import { auth0MW } from '../middlewares/authMW.js';
import { accessTokenErrMW } from '../middlewares/errorMW.js';
import upload from '../config/multerConfig.js';
import uploadSubCategoryController from '../controllers/uploadSubCategoryController.js';
import deleteSubCategoryController from '../controllers/deleteSubCategoryController.js';
import editSubCategoryController from '../controllers/editSubCategoryController.js';

const router = express.Router();

// This route specific middleware and error middleware
router.use(auth0MW)
router.use(accessTokenErrMW)    // handles access token error

router.get('/testing', (req, res) => {
    res.send('authSubCategoryRoute is working 👍🙂')
})

router.post('/upload', upload.single('image'), uploadSubCategoryController)
router.put('/update', upload.single('image'), editSubCategoryController)
router.delete('/delete', deleteSubCategoryController)


export default router;