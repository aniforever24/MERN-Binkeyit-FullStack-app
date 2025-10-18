import express from 'express'
import 'dotenv/config';
import { auth0MW } from '../middlewares/authMW.js'
import { accessTokenErrMW, multerErrMW} from '../middlewares/errorMW.js'
import uploadAvatarController from '../controllers/uploadAvatarController.js';
import upload from '../config/multerConfig.js';
import updateUserDetailsController from '../controllers/updateUserDetailsController.js';
import userDetailsValidationMW from '../middlewares/userDetailsValidationMW.js';
import sendVerificationEmailController from '../controllers/sendVerificationEmailController.js';
import logoutController from '../controllers/logoutController.js';
import userDetailsController from '../controllers/userDetailsController.js';
import uploadImageController from '../controllers/uploadImageConroller.js';

const router = express.Router()

router.use(auth0MW)     // This middleware authenticates this route
router.use(accessTokenErrMW)    // handles access token error

router.put('/upload-avatar', upload.single('avatar'), multerErrMW, uploadAvatarController)
router.put('/update-user-details',userDetailsValidationMW , updateUserDetailsController)
router.get('/send-verification-email', sendVerificationEmailController)
router.put('/logout', logoutController)
router.get('/user-details', userDetailsController)
router.post('/upload-image', upload.single('image'), multerErrMW, uploadImageController)


export default router