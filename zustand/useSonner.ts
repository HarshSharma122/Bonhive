import { create } from "zustand";
import { persist } from "zustand/middleware";

// const [isShow, setIsShow] = useState(true);
type sonnerStoreState = {
  isShow: boolean;
  setIsShow: (isShow: boolean) => void;
};

export const useSonnerStore = create<sonnerStoreState>()((set) => ({
  isShow: false,
  setIsShow: (isShow: boolean) => set({ isShow }),
}));
