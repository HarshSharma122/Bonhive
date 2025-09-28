import PROJECT from "@/models/project.model";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const {
      instructions,
      proposal,
      projectId,
      hour,
      second,
      minute,
      markdown,
      statusUpdate,
      service_name,
      service_type,
      service_price,
      service_duration,
    } = await req.json();

    if (!projectId) {
      throw new Error("No project is selected");
    }

    let payment = 0;

    if (instructions || proposal) {
      const response = await PROJECT.findById(projectId);
      response.status = "pending",
      response.proposal = proposal,
      response.instructions = instructions

      response.save();
    }
    if (statusUpdate) {
      const completedMonth = new Date().toLocaleString("default", {
        month: "short",
      });
      const response = await PROJECT.findById(projectId);
      response.status = statusUpdate;
      response.completedMonth = completedMonth
      
      
      
      
      response.save();
    }
    if (service_name || service_type || service_price || service_duration) {
      const response = await PROJECT.findById(projectId);
      const ServiceObject = {
        service_name,
        service_type,
        service_price,
        service_duration,
      };
      response.services.push(ServiceObject);
      response.save();
    }
    if (hour || second || minute || markdown) {
      const response = await PROJECT.findById(projectId);
      let totalHour = 0;
      let totalMin = 0;
      let totalSec = 0;

      totalHour = hour;
      totalMin = minute;
      totalSec = second;

      totalMin += Math.floor(totalSec / 60);
      totalSec = totalSec % 60;
      totalHour += Math.floor(totalMin / 60);
      totalMin = totalMin % 60;
      const hourlyRate = response?.hourlyRate;

      const converttoSecond = totalMin * 60 + totalSec;
      payment = (converttoSecond / 3600) * hourlyRate + hourlyRate * totalHour;

      const conversion = minute * 60 + second;
      const rate = (conversion / 3600) * hourlyRate + hourlyRate * hour;

      const markArray = {
        hour,
        second,
        minute,
        markdown,
        rate,
      };

      response.projectLogs.push(markArray);
      response.totalHour = (response.totalHour | 0) + totalHour;
      response.totalMin = (response.totalMin | 0) + totalMin;
      response.totalSec = (response.totalSec | 0) + totalSec;

      if (!response.totalBill) {
        response.totalBill = payment;
      } else {
        response.totalBill += payment;
      }
      response.save();
    }
    return NextResponse.json({ data: "updated SuccessFully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
};
