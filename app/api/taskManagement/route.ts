import { connectDb } from "@/lib/db";
import PROJECT from "@/models/project.model";
import UserProfile from "@/models/userProfile.model";
import { plunk } from "@/utilis/plunk-email";
import moment from "moment-timezone";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    await connectDb();
    const userProfile = await UserProfile.find({});
    await Promise.all(
      userProfile.map(async (user) => {
        const userTime = moment().tz(user.userTimeZone);
        if (!userTime) return;
        const currentHour = userTime.hour();
        const currentMin = userTime.minute();

        

        const userDate = moment(user.lastNotified).tz(user.userTimeZone);
       
        
        
        if (!user.lastNotified || !userDate.isSame(userTime, "day")) {
          user.isNotifyToday = false;
          await user.save();
        }        


        if (currentHour === 7 && currentMin <= 50) {
          const projects = await PROJECT.find({ userId: user.userId });
          console.log(currentHour);
          

          if (!projects.length) return;

          const today = new Date();

          const urgencyFn = projects.reduce((prev, next) => {
            const projectName = next.projectName;
            const projectPriority = next.projectPriority;
            const deadline = next.duration;
            const difference = new Date(deadline).getTime() - today.getTime();
            const oneDayInMilliseconds = 1000 * 60 * 60 * 24;
            const daysLeft = Math.ceil(difference / oneDayInMilliseconds);

            const urgency =
              projectPriority == "high"
                ? 3
                : projectPriority == "medium"
                ? 2
                : 1;

            const Urgency = urgency / daysLeft;

            prev[projectName] = (prev[projectName] || 0) + Urgency;

            return prev;
          }, []);

          const urgencyValue: number[] = Object.values(urgencyFn);

          const totalUrgency = urgencyValue.reduce(
            (prev: number, next: number) => prev + next,
            0
          );

          const focus = projects.reduce((prev, next) => {
            const projectName = next.projectName;
            const projectPriority = next.projectPriority;
            const deadline = next.duration;
            const difference = new Date(deadline).getTime() - today.getTime();
            const oneDayInMilliseconds = 1000 * 60 * 60 * 24;
            const daysLeft = Math.ceil(difference / oneDayInMilliseconds);

            const urgency =
              projectPriority == "high"
                ? 3
                : projectPriority == "medium"
                ? 2
                : 1;

            const ur = urgency / daysLeft;
            const focusPercentage = Math.round((ur / totalUrgency) * 100);

            prev.push({
              projectName,
              projectPriority,
              deadline,
              focusPercentage,
            });
            return prev;
          }, []);

          type focusType = {
            projectName: string;
            projectPriority: string;
            deadline: string;
            focusPercentage: number;
          };

          const emailBody = `
          <div style="font-family: 'Inter', Arial, sans-serif; color: #1e293b; background-color: #f9fafb; padding: 20px; border-radius: 10px;">
            <h2 style="color: #4f46e5;">Good Morning, ${user.userName} 👋</h2>
            <p style="font-size: 15px; color: #334155;">
              Here’s your <strong>Bonhive Daily Focus Report</strong> for <b>${new Date().toDateString()}</b>.
              Stay productive and focused today
            </p>
  
            <table style="border-collapse: collapse; width: 100%; margin-top: 20px; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
              <thead style="background-color: #4f46e5; color: #ffffff;">
                <tr>
                  <th style="text-align:left; padding: 10px;">Project</th>
                  <th style="padding: 10px;">Priority</th>
                  <th style="padding: 10px;">Deadline</th>
                  <th style="padding: 10px;">Focus</th>
                </tr>
              </thead>
              <tbody>
                ${focus
                  .map(
                    (p: focusType, i: number) => `
                    <tr style="background-color: ${
                      i % 2 === 0 ? "#f8fafc" : "#ffffff"
                    };">
                      <td style="padding: 10px; font-weight: 500;">${
                        p.projectName
                      }</td>
                      <td style="padding: 10px;">
                        <span style="
                          background-color: ${
                            p.projectPriority === "high"
                              ? "#fee2e2"
                              : p.projectPriority === "medium"
                              ? "#fef9c3"
                              : "#dcfce7"
                          };
                          color: ${
                            p.projectPriority === "high"
                              ? "#b91c1c"
                              : p.projectPriority === "medium"
                              ? "#92400e"
                              : "#166534"
                          };
                          padding: 4px 8px;
                          border-radius: 6px;
                          font-size: 13px;
                          font-weight: 600;
                        ">
                          ${p.projectPriority}
                        </span>
                      </td>
                      <td style="padding: 10px; color: #475569;">${new Date(
                        p.deadline
                      ).toLocaleDateString()}</td>
                      <td style="padding: 10px; font-weight: bold; color: #4f46e5;">${
                        p.focusPercentage
                      }%</td>
                    </tr>`
                  )
                  .join("")}
              </tbody>
            </table>
  
            <div style="margin-top: 25px; background: #eef2ff; padding: 15px; border-radius: 8px; border-left: 4px solid #4f46e5;">
              <p style="margin: 0; font-size: 14px; color: #4338ca;">
                💡 <b>Pro Tip:</b> Start your day with projects having the <strong>highest focus %</strong> and <strong>earliest deadlines</strong>.
              </p>
            </div>
  
            <div style="margin-top: 30px; text-align: center;">
              <a href="https://bonhive.site/dashboard"
                 style="display: inline-block; background:#4f46e5; color:white; padding:12px 20px; border-radius:8px; text-decoration:none; font-weight: 600;">
                 🚀 Open Dashboard
              </a>
            </div>
  
            <p style="margin-top: 30px; font-size: 13px; color: #64748b; text-align:center;">
              Stay consistent & keep building great things,<br>
              — <strong>Team Bonhive</strong>
            </p>
          </div>
        `;

          if (!user.isNotifyToday) {
            await plunk.emails.send({
              to: user.userEmail,
              subject: `Good Morning ${user.userName}`,
              body: emailBody,
            });

            user.isNotifyToday = true;
            user.lastNotified = new Date().toISOString();
            await user.save();
          }
        }
      })
    );

    return NextResponse.json(
      {
        data: "Email sent successFully",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: error,
      },
      { status: 500 }
    );
  }
};
