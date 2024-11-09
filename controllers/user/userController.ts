import { Request, Response } from "express";
import { UserModel } from "../../models/user/userModel";
import { ManagerModel } from "../../models/user/managerModel";
import { AdminModel } from "../../models/user/adminModel";

interface CustomRequest extends Request {
  user?: any;
}

// CREATE User

export const createUser = async (req: CustomRequest, res: Response) => {
  try {
    const { name, password, email } = req.body;

    // Check if all required fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    // Check if a user with the same email exists in any of the models
    const existingUserInUserModel = await UserModel.findOne({ email });
    const existingUserInManagerModel = await ManagerModel.findOne({ email });
    const existingUserInAdminModel = await AdminModel.findOne({ email });

    if (existingUserInUserModel || existingUserInManagerModel || existingUserInAdminModel) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    // Validate password (e.g., minimum length requirement)
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    // Create the new user
    const user = new UserModel({
      name,
      password, // Ensure password is hashed before saving (e.g., using bcrypt)
      email,
      role: "user",
      createdBy: req.user.id,
    });

    // Save the new user
    await user.save();

    // Return success message
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.log("Error creating user:", error); // Improved logging
    res.status(500).json({ message: "Error creating user" });
  }
};


// READ all Users
export const getAllUsers = async (req: CustomRequest, res: Response) => {
  try {
    const users = await UserModel.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

// UPDATE User
export const updateUser = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const user = await UserModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error updating user" });
  }
};

// DELETE User
export const deleteUser = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;
    await UserModel.findByIdAndDelete(id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
};
