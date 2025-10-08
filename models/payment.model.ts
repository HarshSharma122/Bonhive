import mongoose, { Date, models, Schema } from "mongoose";

type payment = {
  _id: mongoose.Types.ObjectId;
  razorpay_signature?: string;
  razorpay_payment_id?: string;
  createdAt: Date;
  updatedAt: Date;
  razorpay_order_id?: string;
  amount: number;
  userId: string;
  type: string;
  status: string;
};

const userSchema = new Schema<payment>(
  {
    razorpay_signature: {
      type: String,
    },
    razorpay_payment_id: {
      type: String,
    },
    razorpay_order_id: {
      type: String,
    },
    amount: {
      type: Number,
    },
    userId: {
      type: String,
    },
    type: {
      type: String,
    },
    status: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const PAYMENT = models?.PAYMENT || mongoose.model("PAYMENT", userSchema);
export default PAYMENT;
