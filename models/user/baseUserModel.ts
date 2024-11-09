import { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

interface BaseUserInterface extends Document {
  name: string;
  email: string;
  password: string;
  status: string;
  profileImage: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const baseUserSchema = new Schema<BaseUserInterface>(
  {
    name: {
      type: String,
      // required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "active",
    },
    profileImage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

baseUserSchema.pre<BaseUserInterface>("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

baseUserSchema.methods.comparePassword = async function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

export { BaseUserInterface, baseUserSchema };
