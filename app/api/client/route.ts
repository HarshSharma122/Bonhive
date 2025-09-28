import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import CLIENT from "@/models/client-details.model";

export const GET = async () => {
  try {
    const user = await getServerSession(authOptions);
    if (!user) {
      return NextResponse.json(
        { data: "You are not authenticated!" },
        { status: 404 }
      );
    }
    const clientArray = await CLIENT.find({ userId: user.user._id });

    if (!clientArray) {
      throw new Error("No data is present");
    }

    return NextResponse.json({ data: clientArray }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ data: error }, { status: 500 });
  }
};
