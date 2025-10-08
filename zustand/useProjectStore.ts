import { ProjectStoreState } from "@/types/bonhive-types";
import { create } from "zustand";
import { persist } from "zustand/middleware";



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
