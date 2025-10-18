import { connectDb } from "@/lib/db";
import CALENDAR from "@/models/calendar.model";
import CLIENT from "@/models/client-details.model";
import PROJECT from "@/models/project.model";
import UserProfile from "@/models/userProfile.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";

export const POST = async (request: NextRequest) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { message: "You are not authenticated" },
        { status: 404 }
      );
    }

    const {
      projectName,
      clientName,
      bidAmount,
      desc,
      duration,
      clientBudget,
      email,
      contact,
      location,
      notes,
      leadSource,
      proposal,
      IshourBillable,
      hourlyRate,
    } = await request.json();

    if (
      !projectName ||
      !clientName ||
      !desc ||
      !clientBudget ||
      !notes ||
      !leadSource
    ) {
      throw new Error("Please fill all the details into the form!");
    }
    connectDb();
    const user = await UserProfile.findOne({ userId: session.user._id });

    if (user.bonhivePlan == "Free" && user.projectCount <= 5) {
      const response = await PROJECT.create({
        projectName,
        clientName,
        bidAmount,
        duration,
        clientBudget,
        email,
        contact,
        location,
        isNotified: false,
        notes,
        leadSource,
        desc,
        proposal,
        userName: session.user.name,
        IshourBillable,
        hourlyRate,
        userId: session.user._id,
        status: leadSource == "freelancing site" ? "pending" : "lead",
      });
      if (response) {
        await UserProfile.findOneAndUpdate(
          {
            userId: session.user._id,
          },
          {
            projectCount: user.projectCount + 1,
            clientCount: user.clientCount + 1,
          },
          { new: true }
        );
      }

      await CLIENT.create({
        clientName,
        bidAmount,
        clientBudget,
        email,
        contact,
        location,
        projectName,
        userId: session.user._id,
      });

      const getDate = response.createdAt;
      const date = new Date(getDate);

      const getMonth = date.toLocaleString("en-us", { month: "long" });
      const getYear = date.toLocaleString("en-us", { year: "numeric" });

      await CALENDAR.create({
        userID: session.user._id,
        userName: session.user.name,
        date: getDate,
        month: getMonth,
        year: getYear,
        time: date.toLocaleTimeString(),
        projectName: response.projectName,
        duration: response.duration, // completion Date
        price: bidAmount,
      });

      return NextResponse.json(
        { message: "Project is successFully saved!" },
        { status: 202 }
      );
    }
    if (user.bonhivePlan == "Pro") {
      const response = await PROJECT.create({
        projectName,
        clientName,
        bidAmount,
        duration,
        clientBudget,
        email,
        contact,
        location,
        notes,
        leadSource,
        desc,
        isNotified: false,
        proposal,
        userName: session.user.name,
        IshourBillable,
        hourlyRate,
        userId: session.user._id,
        status: leadSource == "freelancing site" ? "pending" : "lead",
      });
      if (response) {
        await UserProfile.findOneAndUpdate(
          {
            userId: session.user._id,
          },
          {
            projectCount: user.projectCount + 1,
            clientCount: user.clientCount + 1,
          },
          { new: true }
        );
      }

      await CLIENT.create({
        clientName,
        bidAmount,
        clientBudget,
        email,
        contact,
        location,
        projectName,
        userId: session.user._id,
      });

      const getDate = response.createdAt;
      const date = new Date(getDate);

      const getMonth = date.toLocaleString("en-us", { month: "long" });
      const getYear = date.toLocaleString("en-us", { year: "numeric" });

      await CALENDAR.create({
        userID: session.user._id,
        userName: session.user.name,
        date: getDate,
        month: getMonth,
        year: getYear,
        time: date.toLocaleTimeString(),
        projectName: response.projectName,
        duration: response.duration, // completion Date
        price: bidAmount,
      });

      return NextResponse.json(
        { message: "Project is successFully saved!" },
        { status: 202 }
      );
    } else {
      return NextResponse.json(
        {
          message: "Error! something went wrong",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        message: error,
      },
      { status: 500 }
    );
  }
};
