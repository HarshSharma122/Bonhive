import mongoose, { models, Mongoose, Schema } from "mongoose";

interface contactType {
  full_name: string;
  email: string;
  subject: string;
  message: string;
  userId: string;
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const contactSchema = new Schema<contactType>(
  {
    full_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const CONTACT = models?.CONTACT || mongoose.model("CONTACT", contactSchema);
export default CONTACT;
