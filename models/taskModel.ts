import mongoose, { Schema, Document, Model } from "mongoose";

interface TaskInterface extends Document {
  title: string;
  description: string;
  dueDate: Date;
  status: "pending" | "in-progress" | "completed";
  creatorId: Schema.Types.ObjectId;
  creatorModelType: string; // To specify the collection for creator
  assignedTo: {
    userId: Schema.Types.ObjectId;
    modelType: string; // To specify the collection for each assigned user
  }[];
}

const taskSchema = new Schema<TaskInterface>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
    creatorId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "creatorModelType", // Dynamic reference based on creatorModelType
    },
    creatorModelType: {
      type: String,
      required: true,
      enum: ["Admin", "Manager", "RegularUser"], // Limit to these collections
    },
    assignedTo: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          required: true,
          refPath: "assignedTo.modelType", // Dynamic reference based on modelType
        },
        modelType: {
          type: String,
          required: true,
          enum: ["Admin", "Manager", "RegularUser"], // Limit to these collections
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const TaskModel: Model<TaskInterface> = mongoose.model("Task", taskSchema);

export { TaskInterface, TaskModel };
