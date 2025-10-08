import { CurrencyStoreState } from "@/types/bonhive-types";
import { create } from "zustand";
import { persist } from "zustand/middleware";



export const useCurrencyPrefStore = create<CurrencyStoreState>()(
  persist(
    (set) => ({
      currencyPref: "", // default preference
      addCurrencyPref: (currencyPref: string) => set({ currencyPref }),
    }),
    {
      name: "currency-pref", // key for localStorage
    }
  )
);
