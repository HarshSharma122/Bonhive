import UserProfile from "@/models/userProfile.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";

export const POST = async(req: NextRequest) => {
  try {
    const userId = await getServerSession(authOptions);

    const res = await req.json();


    if(!res.oneSignalId)
    {
        throw new Error("No id found");
    }    
    const user = await UserProfile.findOne({
        userId:userId?.user._id
    })
    user.oneSignal_id = res.oneSignalId
    await user.save();
    return NextResponse.json({msg:"ok"},{status:200});
  } catch (error) {
    console.log(error);
    
  }
};
