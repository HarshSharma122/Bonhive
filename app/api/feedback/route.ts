import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import UserProfile from "@/models/userProfile.model";
import { connectDb } from "@/lib/db";

export const POST = async (req: NextRequest) => {
  try {
    const user = await getServerSession(authOptions);

    const { feedBack_type, feedBack } = await req.json();

    if (!user) {
      return NextResponse.json(
        { msg: "You are not authenticated" },
        { status: 404 }
      );
    }

    if (!feedBack_type || !feedBack) {
      return NextResponse.json(
        { msg: "fill all the details" },
        { status: 404 }
      );
    }

    connectDb();
    const userProfile = await UserProfile.findOne({ userId: user.user._id });

    if (!userProfile) {
      return NextResponse.json(
        { msg: "something went wrong" },
        { status: 404 }
      );
    }

    userProfile.user_feedback.feedBack_type = feedBack_type;
    userProfile.user_feedback.feedBack = feedBack;

    userProfile.save();
    return NextResponse.json({ msg: " your record is saved" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ msg: error }, { status: 404 });
  }
};
