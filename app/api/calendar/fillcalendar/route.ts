import { getServerSession } from "next-auth";
import {NextResponse} from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import { connectDb } from "@/lib/db";
import CALENDAR from "@/models/calendar.model";

export const GET = async () => {
  try {
    const currentUserDetails = await getServerSession(authOptions);
    if (!currentUserDetails) {
      return NextResponse.json(
        { message: "You are not authenticated" },
        { status: 404 }
      );
    }

    connectDb();

    const response = await CALENDAR.find({
      userID: currentUserDetails.user._id,
    }).select("-createdAt -updatedAt -__v -_id -userID");

   
    return NextResponse.json({ data: response }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: error},
      { status: 500 }
    );
  }
};
