import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import PROJECT from "@/models/project.model";
import UserProfile from "@/models/userProfile.model";
import axios from "axios";

export async function GET() {
  try {
    await connectDb();

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Find projects whose deadline is tomorrow and not notified yet
    const projects = await PROJECT.find({
      duration: { $lte: tomorrow },
      isNotified: false,
    });

    for (const project of projects) {
      const user = await UserProfile.findOne({ userId: project.userId });

      const r = await axios.post(
        "https://onesignal.com/api/v1/notifications",
        {
          app_id: process.env.ONE_SIGNAL_APP_ID,
          include_external_user_ids: [user.oneSignal_id],
          headings: { en: "Project Deadline Reminder" },
          contents: {
            en: `Your project "${project.projectName}" is due tomorrow!`,
          },
        },
        {
          headers: {
            Authorization: `Basic ${process.env.ONESIGNAL_REST_API_KEY}`,
          },
        }
      );

      // Mark notified so you don’t send twice
      project.isNotified = true;
      await project.save();
    }

    return NextResponse.json({
      message: `✅ Sent ${projects.length} reminders successfully.`,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
