import express from 'express';
import { createUser, deleteManager, getAllManagers, updateManager } from '../../controllers/user/managerController';
import { verifyToken } from '../../middleware/auth';
import { isAdmin, isManagerOrAdmin } from '../../middleware/roleAuth';
import { createManager } from '../../controllers/user/adminController';

const router = express.Router();
router.post('/create-manager',verifyToken, isAdmin, createManager);
router.get('/getAll', verifyToken, isAdmin, getAllManagers);
router.put('/update/:id', verifyToken, isAdmin, updateManager);
router.delete('/delete/:id', verifyToken, isAdmin, deleteManager);

export default router;