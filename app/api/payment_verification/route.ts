import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import UserProfile from "@/models/userProfile.model";
import crypto from "crypto";
import { redirect } from "next/navigation";
import PAYMENT from "@/models/payment.model";
import { connectDb } from "@/lib/db";
import { razorpay } from "@/utilis/razorpay";
export const POST = async (req: NextRequest) => {
  try {
    const user = await getServerSession(authOptions);

    if (!user) {
      return NextResponse.json(
        {
          msg: "You are not authenticated first go for a authentication",
        },
        {
          status: 404,
        }
      );
    }
    const userProfile = await UserProfile.findOne({
      userId: user.user._id,
    });
    const {
      razorpay_signature,
      razorpay_payment_id,
      razorpay_subscrption_id,
      amount,
      PricePlanType,
      subscriptionId,
    } = await req.json();

    const date = new Date();
  
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(razorpay_payment_id + "|" + subscriptionId, "utf-8")
      .digest("hex");

    const isAuthentic = generated_signature === razorpay_signature;

    if (!isAuthentic) {
      redirect(`${process.env.FRONTEND_URL}/paymentFailed`);
    }

    await PAYMENT.create({
      razorpay_signature,
      razorpay_payment_id,
      razorpay_subscrption_id,
    });
    connectDb();

    

    userProfile.bonhivePlan = PricePlanType;
    userProfile.isPlanSelected = true;
    userProfile.subscrption.id = subscriptionId;
    userProfile.subscrption.createdDate = date
    userProfile.subscrption.price = amount / 100;
    userProfile.subscrption.status = "active";
    userProfile.save();




    return NextResponse.json(
      {
        msg: "Payment is verified",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        msg: error,
      },
      {
        status: 500,
      }
    );
  }
};
