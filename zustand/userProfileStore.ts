import { create } from "zustand";
import { persist } from "zustand/middleware";
type user = {
  userLanguage: string;
  bonhivePlan: string;
  isPlanSelected: boolean;
  clientCount?: number;
  subscrption: {
    createdDate: string;
  };
};

type ProfileStoreState = {
  user: user;
  setUser: (user: user) => void;
};

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
      },
      setUser: (user) => set({ user }),
    }),
    {
      name: "userProfile",
    }
  )
);
