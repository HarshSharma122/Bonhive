import { statusStoreState } from "@/types/bonhive-types";
import { create } from "zustand";


export const useStatusStore = create<statusStoreState>()((set) => ({
  isAnimate: false,
  setIsAnimate: (isAnimate: boolean) => set({ isAnimate }),
}));
