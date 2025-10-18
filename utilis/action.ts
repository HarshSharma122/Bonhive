"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { connectDb } from "@/lib/db";
import CONTACT from "@/models/contact.model";
import { getServerSession } from "next-auth";
import { cache } from "react";

const contactForm = cache(async ({
  full_name,
  email,
  subject,
  message,
}: {
  full_name: string;
  email: string;
  subject: string;
  message: string;
}) => {
  const user = await getServerSession(authOptions);
  connectDb();
  await CONTACT.create({
    full_name,
    email,
    subject,
    message,
    userId: user?.user._id,
  });
});


export default contactForm