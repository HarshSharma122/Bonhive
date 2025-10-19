import { ProfileStoreState } from "@/types/bonhive-types";
import { create } from "zustand";
import { persist } from "zustand/middleware";


export const useProfileStore = create<ProfileStoreState>()(
  persist(
    (set) => ({
      user: {
        userLanguage: "",
        bonhivePlan: "",
        isPlanSelected: false,
        clientCount: 0,
        subscrption: {
          createdDate: "",
        },
        oneSignal_id:"",
        
      },
      setUser: (user) => set({ user }),
    }),
    {
      name: "userProfile",
    }
  )
);
