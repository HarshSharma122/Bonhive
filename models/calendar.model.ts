import mongoose, { models, Schema } from "mongoose";

interface calendarType {
  userID: string;
  userName: string;
  month: string;
  year: string;
  date: string;
  time: string;
  projectName: string;
  duration: string;
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  price:number;
}

const calendarSchema = new Schema<calendarType>(
  {
    userID: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    month: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    projectName: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    price:{
      type:Number,
    }
  },
  {
    timestamps: true,
  }
);

const CALENDAR = models?.CALENDAR || mongoose.model("CALENDAR", calendarSchema);
export default CALENDAR;
