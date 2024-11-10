import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AdminModel } from "../../models/user/adminModel";
import { ManagerModel } from "../../models/user/managerModel";
import { UserModel } from "../../models/user/userModel";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    let user: any = null;
    let role = "";

    // Check Admin collection
    user = await AdminModel.findOne({ email });
    if (user) {
      role = "Admin";
    }

    // Check Manager collection if user wasn't found
    if (!user) {
      user = await ManagerModel.findOne({ email });
      if (user) {
        role = "Manager";
      }
    }
    // Check User collection if user still wasn't found
    if (!user) {
      user = await UserModel.findOne({ email });
      if (user) {
        role = "RegularUser";
      }
    }

    // If no user is found or account is inactive, return an error
    if (!user || user.status !== "active") {
      return res
        .status(401)
        .json({ message: "Invalid credentials or inactive account" });
    }

    // Verify the password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Update the last login time
    user.lastLogin = new Date();
    await user.save();

    // Generate a JWT token
    const token = jwt.sign(
      { id: user._id, role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "24h" }
    );

    // Send token and user information in response
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login error" });
  }
};

export const getCurrentLoginUser = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Authorization token is missing" });
    }

    // Decode the token
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    // Define variables to hold user and role information
    let user: any = null;
    let role = "";

    // Check each model for the user
    user = await AdminModel.findById(decoded?.id).select(
      "-password"
    );
    if (user) role = "Admin";

    if (!user) {
      user = await ManagerModel.findById(decoded?.id).select(
        "-password"
      );
      if (user) role = "Manager";
    }

    if (!user) {
      user = await UserModel.findById(decoded?.id).select(
        "-password"
      );
      if (user) role = "RegularUser";
    }

    // If user not found, return 404
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with user data and user type
    res.status(200).json({
      success: true,
      user,
      role,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const searchUsers = async (req: Request, res: Response) => {
  try {
    const { query } = req.query; 
    
    if (!query || typeof query !== "string") {
      return res.status(400).json({ message: "Search term is required and must be a string" });
    }

    // Create a regex search pattern to make it case-insensitive
    const regex = new RegExp(query, "i"); // 'i' flag for case-insensitive matching

    // Search across Admin, Manager, and User collections
    const admins = await AdminModel.find({
      $or: [
        { name: { $regex: regex } },
        { email: { $regex: regex } },
      ]
    }).select("-password"); // Exclude password field

    const managers = await ManagerModel.find({
      $or: [
        { name: { $regex: regex } },
        { email: { $regex: regex } },
      ]
    }).select("-password");

    const users = await UserModel.find({
      $or: [
        { name: { $regex: regex } },
        { email: { $regex: regex } },
      ]
    }).select("-password");

    // Combine all results into a single array
    const result = [
      ...admins.map(user => ({ ...user.toObject(), role: "Admin" })),
      ...managers.map(user => ({ ...user.toObject(), role: "Manager" })),
      ...users.map(user => ({ ...user.toObject(), role: "RegularUser" }))
    ];

    // Return the combined results
    res.status(200).json({ success: true, results: result });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Error searching users" });
  }
};

