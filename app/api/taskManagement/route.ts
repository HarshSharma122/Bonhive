import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import TASK from "@/models/task.model";
import { connectDb } from "@/lib/db";

export const POST = async (req: NextRequest) => {
  try {
    const getUser = await getServerSession(authOptions);

    const { perDayWorkingHour } = await req.json();

    console.log(perDayWorkingHour);
    
    if (!getUser) {
      return NextResponse.json(
        {
          message: "You are not authenticated!",
        },
        {
          status: 404,
        }
      );
    }
    connectDb();
    const response = await TASK.create({
      userId: getUser.user._id,
    });
    
    response.totalWorkingHour.push(perDayWorkingHour);
    response.save();
    return NextResponse.json(

      {
        data: "saved",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: error,
      },
      { status: 500 }
    );
  }
};
