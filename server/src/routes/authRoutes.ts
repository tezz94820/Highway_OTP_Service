import express from 'express';
import { validateAsSchema } from '../middleware/validation';
import { getOtpValidationSchema, loginValidationSchema, registerValidationSchema, verifyOtpValidationSchema } from '../validations/auth';
import { getOtp, login, register, verifyOtp } from '../controller/auth';

const router = express.Router();

router.post('/register', validateAsSchema(registerValidationSchema), register);
router.post('/otp/email', validateAsSchema(getOtpValidationSchema), getOtp);
router.post('/otp/verify', validateAsSchema(verifyOtpValidationSchema), verifyOtp);
router.post('/login', validateAsSchema(loginValidationSchema), login);


export default router;