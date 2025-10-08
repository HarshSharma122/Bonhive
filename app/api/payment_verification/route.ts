import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import PAYMENT from "@/models/payment.model";
import UserProfile from "@/models/userProfile.model";
import { connectDb } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export const POST = async (req: NextRequest) => {
  try {
    await connectDb();

    const user = await getServerSession(authOptions);
    if (!user) {
      return NextResponse.json({ msg: "Not authenticated" }, { status: 401 });
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
      PricePlanType,
    } = await req.json();

    // 🔹 Generate expected signature
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    // 🔹 Compare
    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ msg: "Payment verification failed" }, { status: 400 });
    }

    // 🔹 Save Payment in DB
    await PAYMENT.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount: amount / 100,
      userId: user.user._id,
      type: "one-time",
      status: "success",
    });

    // 🔹 Update User Profile
    const userProfile = await UserProfile.findOne({ userId: user.user._id });
    if (userProfile) {
      userProfile.bonhivePlan = PricePlanType;
      userProfile.isPlanSelected = true;
      userProfile.subscrption = {
        id: razorpay_order_id,
        createdDate: new Date(),
        price: amount / 100,
        status: "active",
      };
      await userProfile.save();
    }

    return NextResponse.json({ msg: "Payment verified successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ msg: error }, { status: 500 });
  }
};
