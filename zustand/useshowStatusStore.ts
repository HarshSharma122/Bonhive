import { create } from "zustand";
type statusStoreState = {
  isAnimate: boolean;
  setIsAnimate: (isAnimate: boolean) => void;
};

export const useStatusStore = create<statusStoreState>()((set) => ({
  isAnimate: false,
  setIsAnimate: (isAnimate: boolean) => set({ isAnimate }),
}));
