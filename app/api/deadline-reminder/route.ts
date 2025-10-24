import { connectDb } from "@/lib/db";
import PROJECT from "@/models/project.model";
import UserProfile from "@/models/userProfile.model";
import { NextResponse } from "next/server";
import moment from "moment";
import { plunk } from "@/utilis/plunk-email";

export const GET = async () => {
  try {
    await connectDb();
    const getUser = await UserProfile.find();

    await Promise.all(
      getUser.map(async (user) => {
        const project = await PROJECT.find({ userId: user.userId });

        if (!project.length) return;

        const number = project.filter((projec_t) => {
          return moment(projec_t.duration).isSame(moment(), "day");
        });

        const projectRows = number
          .map(
            (p, i) => `
        <tr style="background-color: ${i % 2 === 0 ? "#f9fafb" : "#ffffff"};">
          <td style="padding: 12px 15px; font-weight: 500; color: #1e293b; font-size: 15px;">${
            p.projectName
          }</td>
          <td style="padding: 12px 15px; color: #475569; font-size: 14px;">${new Date(
            p.duration
          ).toLocaleDateString()}</td>
        </tr>`
          )
          .join("");

        const emailBody = `
      <div style="font-family: 'Inter', Arial, sans-serif; color: #1e293b; background-color: #f8fafc; padding: 30px;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); overflow: hidden;">
          <div style="background-color: #4f46e5; color: white; padding: 20px 25px;">
            <h2 style="margin: 0; font-size: 20px;">Hey ${user.userName} 👋</h2>
            <p style="margin: 6px 0 0; font-size: 14px; opacity: 0.9;">Here’s your project deadline reminder</p>
          </div>

          <div style="padding: 25px;">
            <p style="font-size: 15px; color: #334155;">
              ⏰ The following project${
                number.length > 1 ? "s" : ""
              } have a <strong>deadline today</strong>:
            </p>

            <table style="border-collapse: collapse; width: 100%; margin-top: 16px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
              <thead>
                <tr style="background-color: #eef2ff; color: #4338ca;">
                  <th style="text-align: left; padding: 12px 15px; font-size: 14px;">Project Name</th>
                  <th style="text-align: left; padding: 12px 15px; font-size: 14px;">Deadline</th>
                </tr>
              </thead>
              <tbody>${projectRows}</tbody>
            </table>

            <div style="margin-top: 25px; background: #f1f5f9; padding: 15px; border-left: 4px solid #4f46e5; border-radius: 8px;">
              <p style="margin: 0; font-size: 14px; color: #334155;">
                ⚡ <strong>Action Required:</strong> Complete your project${
                  number.length > 1 ? "s" : ""
                } before the deadline to stay on track.
              </p>
            </div>

            <div style="margin-top: 30px; text-align: center;">
              <a href="https://bonhive.site/dashboard"
                 style="display: inline-block; background:#4f46e5; color:white; padding:12px 22px; border-radius:8px; text-decoration:none; font-weight: 600; font-size: 15px;">
                 🚀 View Projects
              </a>
            </div>
          </div>

          <div style="background: #f9fafb; padding: 15px; text-align:center; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0; font-size: 13px; color: #64748b;">
              — <strong>Team Bonhive</strong><br>
              Building smarter tools for freelancers 💼
            </p>
          </div>
        </div>
      </div>
`;

        await plunk.emails.send({
          to: user.userEmail,
          subject: `Reminder: ${number.length} project${
            number.length > 1 ? "s" : ""
          } due today ⏰`,
          body: emailBody,
        });
      })
    );


    
    return NextResponse.json({ msg: "success" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ msg: error }, { status: 500 });
  }
};
