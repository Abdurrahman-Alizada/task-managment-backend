import express from "express";
import authRoutes from "./user/authRoutes";
import adminRoutes from "./user/adminRoutes";
import managerRoutes from "./user/managerRoutes";
import taskRoutes from "./taskRoutes";
import userRoutes from "./user/userRoutes";

const router = express.Router();

// common routes in users
router.use("/auth", authRoutes);
//  user specific routes
router.use("/regular-user", userRoutes);
router.use("/manager", managerRoutes);
router.use("/admin", adminRoutes);

// tasks routes
router.use("/tasks", taskRoutes);

export default router;
