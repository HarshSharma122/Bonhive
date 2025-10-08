import { sonnerStoreState } from "@/types/bonhive-types";
import { create } from "zustand";



export const useSonnerStore = create<sonnerStoreState>()((set) => ({
  isShow: false,
  setIsShow: (isShow: boolean) => set({ isShow }),
}));
