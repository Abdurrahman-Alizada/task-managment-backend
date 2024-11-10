import { Request, Response } from 'express';
import { UserModel } from '../../models/user/userModel';
import { ManagerModel } from '../../models/user/managerModel';

interface CustomRequest extends Request {
  user?: any;
}

export const createUser = async (req: CustomRequest, res: Response) => {
  try {
    const { username, password, email } = req.body;
    
    const user = new UserModel({
      username,
      password,
      email,
      role: 'user',
      managerId: req.user.id,
      createdBy: req.user.id
    });

    await user.save();
    
    res.status(201).json({
      message: 'User created successfully',
      // user: {
      //   id: user._id,
      //   username: user.username,
      //   email: user.email
      // }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user' });
  }
};

// READ all Managers
export const getAllManagers = async (req: CustomRequest, res: Response) => {
  try {
    const managers = await ManagerModel.find();
    res.json(managers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching managers' });
  }
};

// UPDATE Manager
export const updateManager = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;
    if (req.body) {
      delete req.body.password;
    }
    const updateData = req.body;
    const manager = await ManagerModel.findByIdAndUpdate(id, updateData);

    if (!manager) {
      return res.status(404).json({ message: 'Manager not found' });
    }

    res.json(manager);
  } catch (error) {
    res.status(500).json({ message: 'Error updating manager' });
  }
};

// DELETE Manager
export const deleteManager = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;
    await ManagerModel.findByIdAndDelete(id);
    res.json({ message: 'Manager deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting manager' });
  }
};