import { connectDb } from "@/lib/db";
import UserProfile from "@/models/userProfile.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import { plunk } from "@/utilis/plunk-email";
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
      userName: user.user.name,
      userId: user.user._id,
    });

    await plunk.emails.send({
      to: user?.user.email!,
      subject: "Welcome to Bonhive! 🎉",
      body: `
                <h1>Welcome, ${user.user.name}</h1>
                <p>Welcome to Bonhive! 🎉We’re excited to help you manage your projects, clients, and deadlines all in one place. Here’s a quick tip to get started:<p>
                <p>1.Add your first project</p>
                <p>2.Download the invoice</p>
                <p>3. Track progress effortlessly</p>
            
                <p>Need help? Our support team is here for you anytime.
     Happy freelancing,
    The Bonhive Team</p>
              `,
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
      "-_id -userId -invoices -updatedAt -createdAt -__v  -projectCount -user_feedback"
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
