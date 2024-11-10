import { Request, Response } from "express";
import { TaskModel } from "../models/taskModel";

interface CustomRequest extends Request {
  user?: any;
}

// CREATE Task
export const createTask = async (req: CustomRequest, res: Response) => {
  try {
    const taskData = req.body;
    const task = new TaskModel({
      ...taskData,
      creatorModelType: req.user?.role,
      creatorId: req.user.id,
      assignedTo: [{ userId: req.user.id, modelType: req.user.role }],
    });
    await task.save();
    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    res.status(500).json({ message: "Error creating task", error });
  }
};

// READ all Tasks
export const getAllTasks = async (req: CustomRequest, res: Response) => {
  try {
    const tasks = await TaskModel.find()
      .populate("creatorId") // Populate creator model dynamically
      .populate("assignedTo.userId"); // Populate user model for each assigned user dynamically
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error });
  }
};

// READ Task by ID
export const getTaskById = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;
    const task = await TaskModel.findById(id)
      .populate("creatorId", "name email") // Populate creator model dynamically
      .populate("assignedTo.userId", "name email"); // Populate assigned users dynamically

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Error fetching task", error });
  }
};

// READ Tasks assigned to or created by the current user
export const getUserTasks = async (req: CustomRequest, res: Response) => {
  try {
    const currentUserId = req.user?.id;

    if (!currentUserId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const tasks = await TaskModel.find({
      $or: [
        { "assignedTo.userId": currentUserId },
        { creatorId: currentUserId },
      ],
    })
      .populate("creatorId", "name email") // Populate creator details
      .populate("assignedTo.userId", "name email"); // Populate assigned user details

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error });
  }
};

// ADD User to AssignedTo
export const addAssignedUser = async (req: CustomRequest, res: Response) => {
  try {
    const { taskId } = req.params; // Task ID
    const { userId, modelType } = req.body; // User ID and modelType to add
    // Validate modelType
    const validModelTypes = ["Admin", "Manager", "RegularUser"];
    if (!validModelTypes.includes(modelType)) {
      return res.status(400).json({ message: "Invalid modelType" });
    }

    const task = await TaskModel.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check if user is already assigned
    if (
      !task.assignedTo.some((assigned) => assigned.userId.toString() === userId)
    ) {
      task.assignedTo.push({ userId, modelType });
      await task.save();
      res.json({ message: "User added to assignedTo", task });
    } else {
      res.status(400).json({ message: "User already assigned" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error adding assigned user", error });
  }
};

// REMOVE User from AssignedTo
export const removeAssignedUser = async (req: CustomRequest, res: Response) => {
  try {
    const { taskId } = req.params;
    const { userId } = req.body;
    const task = await TaskModel.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Remove user from assignedTo array
    task.assignedTo = task.assignedTo.filter(
      (assignedUser) => assignedUser.userId.toString() !== userId
    );
    await task.save();

    res.json({ message: "User removed from assignedTo", task });
  } catch (error) {
    res.status(500).json({ message: "Error removing assigned user", error });
  }
};

// UPDATE Task
export const updateTask = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const task = await TaskModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Error updating task", error });
  }
};

// DELETE Task
export const deleteTask = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;
    const task = await TaskModel.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", error });
  }
};
