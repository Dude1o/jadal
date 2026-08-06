import { create } from "zustand";

interface SpinnerStore {
  pending: number;
  isLoading: boolean;
  start: () => void;
  stop: () => void;
}

export const useSpinnerStore = create<SpinnerStore>((set) => ({
  pending: 0,
  isLoading: false,
  start: () =>
    set((state) => ({ pending: state.pending + 1, isLoading: true })),
  stop: () =>
    set((state) => {
      const next = Math.max(0, state.pending - 1);
      return { pending: next, isLoading: next > 0 };
    }),
}));
