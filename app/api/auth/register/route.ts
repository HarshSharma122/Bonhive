import { connectDb } from "@/lib/db";
import USER from "@/models/user.model";
import { plunk } from "@/utilis/plunk-email";
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

//     await plunk.emails.send({
//       to: email,
//       subject: "Welcome to Bonhive! 🎉",
//       body: `
//             <h1>Welcome, ${username}</h1>
//             <p>Welcome to Bonhive! 🎉We’re excited to help you manage your projects, clients, and deadlines all in one place. Here’s a quick tip to get started:<p>
//             <p>1.Add your first project</p>
//             <p>2.Download the invoice</p>
//             <p>3. Track progress effortlessly</p>
        
//             <p>Need help? Our support team is here for you anytime.
//  Happy freelancing,
// The Bonhive Team</p>
//           `,
//     });

    return NextResponse.json(
      { message: "Your account is successfully created" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong! please check at ones", error },
      { status: 500 }
    );
  }
};
