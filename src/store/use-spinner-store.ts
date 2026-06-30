import { create } from "zustand";

interface SpinnerStore {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  show: () => void;
  hide: () => void;
}

export const useSpinnerStore = create<SpinnerStore>((set) => ({
  isLoading: false,
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  show: () => set({ isLoading: true }),
  hide: () => set({ isLoading: false }),
}));
