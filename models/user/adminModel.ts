import { baseUserSchema, BaseUserInterface } from "./baseUserModel";
import mongoose, { Model, Schema } from "mongoose";

interface AdminInterface extends BaseUserInterface {
  // role: string;
  permissions: string[];
}

const adminSchema = new Schema<AdminInterface>({
  // role: { type: String, required: true, default: "Admin" },
  permissions: { type: [String], default: [] },
});

adminSchema.add(baseUserSchema);

const AdminModel: Model<AdminInterface> = mongoose.model("Admin", adminSchema);

export { AdminInterface, AdminModel };
