import { getServerSession } from "next-auth";
import {NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import UserProfile from "@/models/userProfile.model";
import PAYMENT from "@/models/payment.model";
import { connectDb } from "@/lib/db";
import { razorpay } from "@/utilis/razorpay";

export const GET = async () => {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { msg: "You are not authenticated. Please login first." },
        { status: 401 }
      );
    }

    await connectDb();

    const userProfile = await UserProfile.findOne({ userId: session.user._id });
    if (!userProfile) {
      return NextResponse.json(
        { msg: "No user profile found." },
        { status: 404 }
      );
    }

    const subscriptionId = userProfile.subscrption?.id;
    if (!subscriptionId) {
      return NextResponse.json(
        { msg: "No active subscription found." },
        { status: 400 }
      );
    }

    // Cancel subscription on Razorpay
    const r  = await razorpay.subscriptions.cancel(subscriptionId);

    

    const payment = await PAYMENT.findOne({
      razorpay_subscrption_id: subscriptionId,
    });

    let refund = false;


    if (payment) {
      const gap = Date.now() - payment.createdAt.getTime();
      const refundTime = Number(process.env.REFUND_DAYS) * 24 * 60 * 60 * 1000;

      if (gap <= refundTime) {
        await razorpay.payments.refund(payment.razorpay_payment_id, {});
        refund = true;
      }
      await payment.deleteOne();
    }





    
    userProfile.subscrption.id = undefined;
    userProfile.subscrption.status = "cancelled";
    userProfile.isPlanSelected = false;
    userProfile.bonhivePlan = undefined
    await userProfile.save();

    return NextResponse.json(
      {
        msg: refund
          ? "Subscription cancelled, refund will be processed within 7 days."
          : "Subscription cancelled successfully (no refund).",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ msg: error }, { status: 500 });
  }
};