import { Request, Response } from "express";
import { AdminModel } from "../../models/user/adminModel";
import { ManagerModel } from "../../models/user/managerModel";
import { UserModel } from "../../models/user/userModel";

interface CustomRequest extends Request {
  user?: any;
}

// CREATE Admin
export const createAdmin = async (req: CustomRequest, res: Response) => {
  try {
    const { name, password, email } = req.body;

    let existingUser: any = null;
    existingUser = await UserModel.findOne({ email });
    existingUser = await ManagerModel.findOne({ email });
    existingUser = await AdminModel.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const admin = new AdminModel({
      name,
      password,
      email,
      role: "admin",
      createdBy: req?.user?.id,
    });

    // Step 4: Save the new admin
    await admin.save();

    // Return success message
    res.status(201).json({ message: "Admin created successfully" });
  } catch (error) {
    console.log("first", error); // You can improve logging to include more details for troubleshooting
    res.status(500).json({ message: "Error creating admin" });
  }
};

// READ all Admins
export const getAllAdmins = async (req: CustomRequest, res: Response) => {
  try {
    const admins = await AdminModel.find();
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: "Error fetching admins" });
  }
};

// UPDATE Admin
export const updateAdmin = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const admin = await AdminModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: "Error updating admin" });
  }
};

// DELETE Admin
export const deleteAdmin = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;
    await AdminModel.findByIdAndDelete(id);
    res.json({ message: "Admin deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting admin" });
  }
};

export const createManager = async (req: CustomRequest, res: Response) => {
  try {
    const { name, password, email, department } = req.body;
    
    const existingUserInUserModel = await UserModel.findOne({ email });
    const existingUserInManagerModel = await ManagerModel.findOne({ email });
    const existingUserInAdminModel = await AdminModel.findOne({ email });

    if (existingUserInUserModel || existingUserInManagerModel || existingUserInAdminModel) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    const manager = new ManagerModel({
      name,
      password,
      email,
      role: "manager",
      department,
      createdBy: req.user?.id,
    });

    await manager.save();

    res.status(201).json({
      message: "Manager created successfully",
      // manager: {
      //   id: manager._id,
      //   username: manager.username,
      //   email: manager.email,
      //   department: manager.department
      // }
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating manager" });
  }
};
