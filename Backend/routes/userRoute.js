import express from 'express'
import 'dotenv/config';
import signupController from '../controllers/signupController.js';
import signupValidatorMW from '../middlewares/signupValidatorMW.js';
import verifyEmailController from '../controllers/verifyEmailController.js';
import loginValidatorMW from '../middlewares/loginValidatorMW.js';
import loginController from '../controllers/loginController.js';
import forgotPasswordController from '../controllers/forgotPasswordController.js';
import forgotPasswordMW from '../middlewares/forgetPasswordMW.js';
import verifyOTPController from '../controllers/verifyOTPController.js';
import resendOTPController from '../controllers/resendOTPController.js';
import resetPasswordMW from '../middlewares/resetPasswordMW.js';
import resetPasswordController from '../controllers/resetPasswordController.js';

const router = express.Router();

router.post('/signup', signupValidatorMW, signupController)
router.get('/verify-email', verifyEmailController)
router.post('/login', loginValidatorMW, loginController)
router.post('/forgot-password',forgotPasswordMW, forgotPasswordController)
router.post('/verify-otp', verifyOTPController)
router.put('/resend-otp', resendOTPController)
router.put('/reset-password', resetPasswordMW, resetPasswordController)

export default router;