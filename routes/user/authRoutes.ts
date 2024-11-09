import express from 'express';
import { login } from '../../controllers/user/authController';

const router = express.Router();
router.post('/login', login);
export default router;