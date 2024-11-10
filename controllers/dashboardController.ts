import { Request, Response } from "express";
import { TaskModel } from "../models/taskModel";
import { AdminModel } from "../models/user/adminModel";
import { ManagerModel } from "../models/user/managerModel";
import { UserModel } from "../models/user/userModel";
import mongoose from "mongoose";

interface CustomRequest extends Request {
  user?: any;
}

export const getDashboardStats = async (req: CustomRequest, res: Response) => {
  try {
    const currentUser = req.user;

    if (!currentUser || !currentUser.role) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    if (currentUser.role === "Admin") {
      // Admin: Get total counts for admins, managers, users, and tasks
      const totalAdmins = await AdminModel.countDocuments();
      const totalManagers = await ManagerModel.countDocuments();
      const totalUsers = await UserModel.countDocuments();
      const totalTasks = await TaskModel.countDocuments();
      const myTasksCount = await TaskModel.countDocuments({
        $or: [{ assignedTo:new mongoose.Types.ObjectId(currentUser.id) }],
      });
      // Calculate total count
      const total = totalAdmins + totalManagers + totalUsers + totalTasks;

      res.json({
        stats: [
          { label: "My Tasks", count: myTasksCount },
          { label: "Administrators", count: totalAdmins },
          { label: "Managers", count: totalManagers },
          { label: "Users", count: totalUsers },
          { label: "Tasks", count: totalTasks },
        ],
        total: {
          label: "Total Records",
          count: total,
        },
      });
    } else if (currentUser.role === "Manager") {
      // Manager: Get counts for their tasks and total users
      const myTasksCount = await TaskModel.countDocuments({
        $or: [{ assignedTo: new mongoose.Types.ObjectId(currentUser.id) }, { creatorId: new mongoose.Types.ObjectId(currentUser.id) }],
      });
      const totalUsers = await UserModel.countDocuments();

      res.json({
        stats: [
          { label: "My Tasks", count: myTasksCount },
          { label: "Total Users", count: totalUsers },
        ],
      });
    } else if (currentUser.role === "RegularUser") {
      // User: Get count of their tasks only
      const myTasksCount = await TaskModel.countDocuments({
        $or: [{ assignedTo: new mongoose.Types.ObjectId(currentUser.id) }, { creatorId: new mongoose.Types.ObjectId(currentUser.id) }],
      });

      res.json({
        stats: [{ label: "My Tasks", count: myTasksCount }],
      });
    } else {
      res.status(403).json({ message: "Unauthorized role" });
    }
  } catch (error) {
    console.error("Error fetching dashboard statistics:", error);
    res
      .status(500)
      .json({ message: "Error fetching dashboard statistics", error });
  }
};
