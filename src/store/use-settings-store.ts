import { create } from "zustand";
import { persist } from "zustand/middleware";

type ViewMode = "cards" | "table";
type Language = "en" | "ar";
type Theme = "light" | "dark" | "system";

interface SettingsStore {
  // State
  view: ViewMode;
  language: Language;
  theme: Theme;

  // Actions
  setView: (view: ViewMode) => void;
  setLanguage: (language: Language) => void;
  setTheme: (theme: Theme) => void;

  // Utility
  reset: () => void;
}

const INITIAL_STATE = {
  view: "cards" as ViewMode,
  language: "en" as Language,
  theme: "system" as Theme,
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      // Initial state
      ...INITIAL_STATE,

      // Actions
      setView: (view) => set({ view }),
      setLanguage: (language) => set({ language }),
      setTheme: (theme) => set({ theme }),

      // Reset to defaults
      reset: () => set(INITIAL_STATE),
    }),
    {
      name: "settings-store", // localStorage key
      version: 1, // Migration version
    },
  ),
);
