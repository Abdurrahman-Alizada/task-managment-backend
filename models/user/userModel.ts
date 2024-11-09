import { baseUserSchema, BaseUserInterface } from "./baseUserModel";
import mongoose, { Model, Schema } from "mongoose";

interface UserInterface extends BaseUserInterface {
  // address: string;
  // phoneNumber: string;
}

const userSchema = new Schema<UserInterface>({
  // address: { type: String, required: true },
  // phoneNumber: { type: String, required: true },
});

userSchema.add(baseUserSchema);

const UserModel: Model<UserInterface> = mongoose.model("RegularUser", userSchema);

export { UserInterface, UserModel };
