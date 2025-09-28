import { connectDb } from "@/lib/db";
import UserProfile from "@/models/userProfile.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
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
    // we have two type first one is free plan and another one is pro plan so here we just talk about free plan.
    const { PricePlanType} = await req.json();
    if (!PricePlanType) {
      return NextResponse.json(
        {
          msg: "Please select one plan",
        },
        {
          status: 404,
        }
      );
    }
    if (PricePlanType == "Pro"){
      const subscrption = await razorpay.subscriptions.create({
        plan_id: process.env.PLAN_ID!,
        customer_notify: 1,
        total_count: 12,
      });
      
      
      return NextResponse.json(
        {
          id:subscrption.id,
        },
        {
          status: 200,
        }
      );
    }
    if (PricePlanType == "Free")
     {
      connectDb();
      await UserProfile.findOneAndUpdate(
        {
          userId: user.user._id,
        },
        {
          bonhivePlan: PricePlanType,
          isPlanSelected: true,
        },
        { new: true }
      );

      return NextResponse.json(
        {
          msg: "ok",
        },
        {
          status: 200,
        }
      );
    }



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
