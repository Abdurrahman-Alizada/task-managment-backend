import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AdminModel } from '../../models/user/adminModel';
import { ManagerModel } from '../../models/user/managerModel';
import { UserModel } from '../../models/user/userModel';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    let user: any = null;
    let role = '';

    // Check Admin collection
    user = await AdminModel.findOne({ email });
    if (user) {
      role = 'Admin';
    } else {
      // Check Manager collection
      user = await ManagerModel.findOne({ email });
      if (user) {
        role = 'Manager';
      } else {
        // Check Regular User collection
        user = await UserModel.findOne({ email });
        if (user) {
          role = 'RegularUser';
        }
      }
    }

    // If no user is found or account is inactive, return an error
    if (!user || user.status !== 'active') {
      return res.status(401).json({ message: 'Invalid credentials or inactive account' });
    }

    // Verify the password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update the last login time
    user.lastLogin = new Date();
    await user.save();

    // Generate a JWT token
    const token = jwt.sign(
      { id: user._id, role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Send token and user information in response
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    console.log("first",error)
    res.status(500).json({ message: 'Login error' });
  }
};
