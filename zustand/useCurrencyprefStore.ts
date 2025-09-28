import { create } from "zustand";
import { persist } from "zustand/middleware";

type CurrencyStoreState = {
  currencyPref: string;
  addCurrencyPref: (currencyPref: string) => void;
};

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
