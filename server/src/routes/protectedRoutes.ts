import express from 'express';
import { Protect } from '../middleware/auth';
import { ProtectedRoute } from '../controller/protected';

const router = express.Router();

router.get('/protectedapi', Protect, ProtectedRoute);

export default router;