import express from 'express';
import { createUser, deleteUser, getAllUsers, updateUser } from '../../controllers/user/userController';
import { verifyToken } from '../../utils/auth';
import { isAdmin, isManagerOrAdmin } from '../../middleware/roleAuth';
import { getUserTasks } from '../../controllers/taskController';

const router = express.Router();

router.post('/create-user', verifyToken, isManagerOrAdmin, createUser);
router.get('/getAll', verifyToken, isManagerOrAdmin, getAllUsers);
router.put('/updateUser/:id', verifyToken, isAdmin, updateUser);
router.delete('/delete/:id', verifyToken, isAdmin, deleteUser);

export default router;