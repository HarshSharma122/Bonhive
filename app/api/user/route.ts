import { connectDb } from "@/lib/db";
import UserProfile from "@/models/userProfile.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";

export const POST = async (req: NextRequest) => {
  try {
    const user = await getServerSession(authOptions);

    if (!user) {
      return NextResponse.json(
        {
          msg: "You are not authenticated",
        },
        {
          status: 404,
        }
      );
    }
    const { userLanguage } = await req.json();
    if (!userLanguage) {
      return NextResponse.json(
        {
          msg: "something went wrong..",
        },
        {
          status: 404,
        }
      );
    }

    connectDb();

    await UserProfile.create({
      userLanguage,
      userName:user.user.name,
      userId: user.user._id,
    });

    

    return NextResponse.json(
      {
        msg: "sucess",
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





export const GET = async () => {
  try {
    const user = await getServerSession(authOptions);

    if (!user) {
      return NextResponse.json(
        {
          msg: "You are not authenticated",
        },
        {
          status: 404,
        }
      );
    }

    connectDb();

    const userProfile = await UserProfile.findOne({
      userId: user.user._id,
    }).select(
      "-_id -userId -invoices -updatedAt -createdAt -__v  -projectCount"
    );

    if (userProfile?.subscrption) {
      userProfile.subscrption.id = null;
      userProfile.subscrption.status = null;
      userProfile.subscrption.price = null;
    }
    return NextResponse.json(
      {
        msg: userProfile,
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
