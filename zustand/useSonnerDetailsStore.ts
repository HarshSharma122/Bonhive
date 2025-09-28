import { create } from "zustand";
import { persist } from "zustand/middleware";

type sonnerDetailsStoreState = {
  sonnerDetails: string;
  addSonnerDetails: (sonnerDetails: string) => void;
};

export const useSonnerDetailsStore = create<sonnerDetailsStoreState>()(
    (set) => ({
      sonnerDetails: "", // default preference
      addSonnerDetails: (sonnerDetails: string) => set({sonnerDetails}),
    }),
);

