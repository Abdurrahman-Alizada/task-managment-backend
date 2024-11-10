import { baseUserSchema, BaseUserInterface } from "./baseUserModel";
import mongoose, { Model, Schema } from "mongoose";

interface ManagerInterface extends BaseUserInterface {
  department: string;
  teamSize: number;
}

const managerSchema = new Schema<ManagerInterface>({
  department: { type: String, },
  teamSize: { type: Number, default: 0 },
});

managerSchema.add(baseUserSchema);

const ManagerModel: Model<ManagerInterface> = mongoose.model("Manager", managerSchema);

export { ManagerInterface, ManagerModel };
