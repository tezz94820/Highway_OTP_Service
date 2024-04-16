import express from 'express';
import authRoutes from './authRoutes';
import protectedRoutes from './protectedRoutes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/protectedapi', protectedRoutes);
router.get('/health', (req, res) => {
    res.status(200).send({ message: 'Server is up and running' });
});

export default router;