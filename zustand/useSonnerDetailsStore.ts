import { sonnerDetailsStoreState } from "@/types/bonhive-types";
import { create } from "zustand";



export const useSonnerDetailsStore = create<sonnerDetailsStoreState>()(
    (set) => ({
      sonnerDetails: "", // default preference
      addSonnerDetails: (sonnerDetails: string) => set({sonnerDetails}),
    }),
);

