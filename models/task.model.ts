import mongoose, { models, Schema } from "mongoose";

interface taskType {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  perDayWorkingHour: string;
  totalWorkingHour: [];
}

const taskSchema = new Schema<taskType>(
  {

    userId: {
      type: String,
      required: true,
    },
    perDayWorkingHour: {
      type: String,
    },
    totalWorkingHour: [
      {
        type: String,
      },
    ],

  },
  {
    timestamps: true,
  }
);

const TASK = models?.TASK || mongoose.model("TASK", taskSchema);
export default TASK;
