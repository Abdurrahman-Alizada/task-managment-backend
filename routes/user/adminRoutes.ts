import express from 'express';
import { createAdmin, deleteAdmin, getAllAdmins, updateAdmin } from '../../controllers/user/adminController';
import { verifyToken } from '../../utils/auth';
import { isAdmin } from '../../middleware/roleAuth';

const router = express.Router();

router.post('/create-admin',verifyToken, isAdmin, createAdmin);
router.get('/getAll', verifyToken, isAdmin, getAllAdmins);
router.put('/admins/:id', verifyToken, isAdmin, updateAdmin);
router.delete('/admins/:id', verifyToken, isAdmin, deleteAdmin);

export default router;
