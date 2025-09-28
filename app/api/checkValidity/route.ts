import { connectDb } from "@/lib/db";
import UserProfile from "@/models/userProfile.model";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { msg: "Not authenticated" },
        {
          status: 404,
        }
      );
    }





    await connectDb();
    const profile = await UserProfile.findOne({ userId: session.user._id });
    if (!profile || !profile.isPlanSelected) {
      return NextResponse.json(
        { msg: "Plan not selected" },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      { msg: "Access Granted" },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
  }
}
