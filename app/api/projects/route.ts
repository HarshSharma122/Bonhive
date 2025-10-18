export const dynamic = "force-dynamic"

import PROJECT from "@/models/project.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import { cache } from "react";
export const GET = cache(async () => {
  try {
    const activeUser = await getServerSession(authOptions);
    if (!activeUser) {
      return NextResponse.json(
        {
          message:
            "You are not authenticated! please first go for a authentication!",
        },
        { status: 404 }
      );
    }
    const project = await PROJECT.find({ userId: activeUser.user._id })
    console.log("fetchinbg project again");
    
    if (!project) {
      return NextResponse.json(
        {
          message: "No project!",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        data: project,
      },
      { status: 200}
    );
  } catch (error) {
    return NextResponse.json(
      {
        message:error
      },
      { status: 500}
    );
  }
});
