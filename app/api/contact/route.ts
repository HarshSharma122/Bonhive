import CONTACT from "@/models/contact.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import { connectDb } from "@/lib/db";

export const POST = async (req: NextRequest) => {
  try {
    const user = await getServerSession(authOptions);
    const { full_name, email, subject, message } = await req.json();
    console.log({ full_name, email, subject, message });

    if (!full_name || !email || !subject || !message) {
      return NextResponse.json(
        { msg: "Please fill all the details" },
        { status: 404 }
      );
    }
    connectDb();
    await CONTACT.create({
      full_name,
      email,
      subject,
      message,
      userId: user?.user._id,
    });

    return NextResponse.json(
      { msg: "Your msg is recorded! we connect with you as soon as possible" },
      { status:200}
    );
  } catch (error) {
    return NextResponse.json({ msg: error }, { status: 500 });
  }
};
