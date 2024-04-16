import express from 'express';
import authRoutes from './authRoutes';
import protectedRoutes from './protectedRoutes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/protectedapi', protectedRoutes);

export default router;