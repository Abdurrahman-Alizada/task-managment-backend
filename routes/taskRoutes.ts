import express from 'express';
import { verifyToken } from '../utils/auth';
import { isAdmin, isManagerOrAdmin } from '../middleware/roleAuth';
import {
  createTask,
  deleteTask,
  getAllTasks,
  getTaskById,
  updateTask,
  addAssignedUser,
  removeAssignedUser,
  getUserTasks
} from '../controllers/taskController';

const router = express.Router();

// Create a new task (Admin only)
router.post('/create', verifyToken, createTask);

// Get all tasks (Admin only)
router.get('/getAll', verifyToken, isManagerOrAdmin, getAllTasks);

// Get a task by ID
router.get('/getTaskById/:id', verifyToken, getTaskById);

router.get('/getUserTasks', verifyToken, getUserTasks);

// Update a task
router.put('/updateTask/:id', verifyToken, updateTask);

// Delete a task (Admin only)
router.delete('/delete/:id', verifyToken, isAdmin, deleteTask);

// Add a user to assignedTo list in a task
router.put('/:taskId/assignUser', verifyToken, addAssignedUser);

// Remove a user from assignedTo list in a task
router.put('/:taskId/unassignUser', verifyToken, removeAssignedUser);

export default router;
