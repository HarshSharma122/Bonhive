import { create } from "zustand";
import { persist } from "zustand/middleware";
interface projectLogs {
  hour: number;
  second: number;
  minute: number;
  rate: number;
  markdown: string;
}
interface services {
  service_name: string;
  service_type: string;
  service_price: number;
  service_duration: string;
}

export interface projects {
  _id: string;
  projectName: string;
  clientName: string;
  bidAmount: number;
  desc: string;
  clientLanguage: string;
  duration: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  clientBudget: number;
  email: string;
  contact: string;
  location: string;
  notes: string;
  leadSource: string;
  proposal: string;
  instructions: string;
  projectLogs: projectLogs[];
  services: services[];
  totalHour: number;
  totalMin: number;
  totalSec: number;
  totalBill: number;
  IshourBillable: boolean;
  completedMonth: string;
  hourlyRate: number;
  userName: string;
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

type ProjectStoreState = {
  projects: projects[];
  addProjects: (project: projects[]) => void;
  addSingleProject: (project: projects) => void;
};

export const useProjectStore = create<ProjectStoreState>()(
  persist(
    (set) => ({
      projects: [],
      addProjects: (projects) => set({ projects }),
      addSingleProject: (project) =>
        set((state) => ({
          projects: [...state.projects, project],
        })),
    }),
    {
      name: "projects",
    }
  )
);
