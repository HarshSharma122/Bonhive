import { connectDb } from "@/lib/db";
import USER from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const { username, email, password } = await request.json();
    if (!username || !email || !password) {
      throw new Error("Please provide the username, email and password");
    }

    connectDb();

    const checkExistingUser = await USER.findOne({ email: email });

    if (checkExistingUser) {
      return NextResponse.json(
        { message: "user is already exist with this " },
        { status: 200 }
      );
    }

    await USER.create({
      username,
      email,
      password,
    });

    return NextResponse.json(
      { message: "Your account is successfully created" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong! please check at ones",error},
      { status: 500}
    );
  }
};
