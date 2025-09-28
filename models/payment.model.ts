import mongoose, { Date, models, Schema } from "mongoose";
import bcrypt from "bcryptjs";

type payment = {
  _id: mongoose.Types.ObjectId;
  razorpay_signature?: string;
  razorpay_payment_id?: string;
  razorpay_subscrption_id: string;
  createdAt: Date;
  updatedAt: Date;
};

const userSchema = new Schema<payment>(
  {
    razorpay_signature: {
      type: String,
    },
    razorpay_payment_id: {
      type: String,
    },
    razorpay_subscrption_id: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);


const PAYMENT = models?.PAYMENT || mongoose.model("PAYMENT", userSchema);
export default PAYMENT;
