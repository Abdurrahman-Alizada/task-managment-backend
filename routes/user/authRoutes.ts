import express from "express";
import {
  getCurrentLoginUser,
  login,
  searchUsers,
} from "../../controllers/user/authController";
import { verifyToken } from "../../utils/auth";
import { isManagerOrAdmin } from "../../middleware/roleAuth";
import { getDashboardStats } from "../../controllers/dashboardController";

const router = express.Router();
router.post("/login", login);
router.get("/currentLoginUser", verifyToken, getCurrentLoginUser);
router.get("/search", verifyToken, isManagerOrAdmin, searchUsers);
router.get("/getDashboardStats", verifyToken, getDashboardStats);

export default router;
