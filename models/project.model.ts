import mongoose, { models, Schema } from "mongoose";

interface projectType {
  projectName: string;
  clientName: string;
  bidAmount: number;
  desc: string;
  isNotified:boolean;
  duration: string;
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  userName: string;
  clientBudget: number;
  email: string;
  contact: string;
  location: string;
  notes: string;
  leadSource: string;
  instructions: string;
  proposal: string;
  projectLogs: string[];
  services: string[];
  totalHour: number;
  totalMin: number;
  totalSec: number;
  totalBill: number;
  IshourBillable: boolean;
  completedMonth: string;
  hourlyRate: number;
  status:
    | "proposal-sent"
    | "negotiation"
    | "accepted"
    | "rejected"
    | "on-hold"
    | "paid"
    | "lead"
    | "pending"
    | "completed"
    | "progress"
    | "review"
    | "payment pending";
}

const projectSchema = new Schema<projectType>(
  {
    projectName: {
      type: String,
      required: true,
    },
    clientName: {
      type: String,
      required: true,
    },
    bidAmount: {
      type: Number,
    },
    desc: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
    },
    userId: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },

    clientBudget: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
    },
    contact: {
      type: String,
    },
    location: {
      type: String,
    },
    notes: {
      type: String,
      required: true,
    },
    leadSource: {
      type: String,
      required: true,
    },
    proposal: {
      type: String,
    },
    status: {
      type: String,
    },
    completedMonth: {
      type: String,
    },
    instructions: {
      type: String,
    },
    IshourBillable: {
      type: Boolean,
    },
    totalBill: {
      type: Number,
      default: 0,
    },

    totalHour: {
      type: Number,
      default: 0,
    },
    totalMin: {
      type: Number,
      default: 0,
    },
    totalSec: {
      type: Number,
      default: 0,
    },
    hourlyRate: {
      type: Number,
      default: 0,
    },
    services: [
      {
        service_name: {
          type: String,
        },
        service_type: {
          type: String,
        },
        service_price: {
          type: Number,
          default: 0,
        },
        service_duration: {
          type: String,
        },
      },
    ],
    projectLogs: [
      {
        hour: Number,
        second: Number,
        minute: Number,
        markdown: String,
        rate: Number,
      },
    ],
    isNotified:{
      type:Boolean,
      required:true,
      default:false,
    }
  },
  {
    timestamps: true,
  }
);

const PROJECT = models?.PROJECT || mongoose.model("PROJECT", projectSchema);
export default PROJECT;
