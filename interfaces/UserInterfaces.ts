import { Document } from 'mongoose';

export interface BaseUserInterface extends Document {
  username: string;
  password: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  isActive?: boolean;
  lastLogin?: Date;
  verifyPassword(password: string): Promise<boolean>;
}

export interface AdminInterface extends BaseUserInterface {
  systemPermissions: string[];
}

export interface ManagerInterface extends BaseUserInterface {
  department: string;
  assignedUsers: string[];
  managementLevel: number;
  createdBy: string;
}

export interface UserInterface extends BaseUserInterface {
  managerId: string;
  createdBy: string;
}
