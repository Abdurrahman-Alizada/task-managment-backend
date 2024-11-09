import express from 'express';
import { verifyToken } from '../middleware/auth';
import { isAdmin } from '../middleware/roleAuth';
import {
  createTask,
  deleteTask,
  getAllTasks,
  getTaskById,
  updateTask,
  addAssignedUser,
  removeAssignedUser
} from '../controllers/taskController';

const router = express.Router();

// Create a new task (Admin only)
router.post('/create', verifyToken, isAdmin, createTask);

// Get all tasks (Admin only)
router.get('/getAll', verifyToken, isAdmin, getAllTasks);

// Get a task by ID
router.get('/getTaskById/:id', verifyToken, getTaskById);

// Update a task
router.put('/updateTask/:id', verifyToken, updateTask);

// Delete a task (Admin only)
router.delete('/delete/:id', verifyToken, isAdmin, deleteTask);

// Add a user to assignedTo list in a task
router.put('/:taskId/assignUser', verifyToken, addAssignedUser);

// Remove a user from assignedTo list in a task
router.put('/:taskId/unassignUser', verifyToken, removeAssignedUser);

export default router;
