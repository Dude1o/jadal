import { create } from "zustand";
import type { ReactNode } from "react";

export interface DialogAction {
  label: string;
  onClick: () => void | Promise<void>;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost";
  closeOnClick?: boolean; // default true
  disabled?: boolean;
}

export interface DialogOptions {
  id?: string;
  title?: string;
  description?: string;
  children?: ReactNode;
  actions?: DialogAction[];
  closeOnOutsideClick?: boolean; // default true
  closable?: boolean; // show X button, default true
  size?: "sm" | "md" | "lg" | "xl" | "full";
  width?: string;
  height?: string;
  onClose?: () => void;
}

interface DialogEntry extends DialogOptions {
  id: string;
}

interface DialogStore {
  dialogs: DialogEntry[];
  open: (options: DialogOptions) => string;
  close: (id: string) => void;
  closeAll: () => void;
}

let counter = 0;

export const useDialogStore = create<DialogStore>((set, get) => ({
  dialogs: [],

  open: (options) => {
    const id = options.id ?? `dialog-${++counter}`;
    // Replace if same id already open
    set((state) => ({
      dialogs: [
        ...state.dialogs.filter((d) => d.id !== id),
        {
          closable: true,
          closeOnOutsideClick: true,
          size: options.size ?? "md",
          ...options,
          id,
        },
      ],
    }));
    return id;
  },

  close: (id) => {
    const dialog = get().dialogs.find((d) => d.id === id);
    dialog?.onClose?.();
    set((state) => ({ dialogs: state.dialogs.filter((d) => d.id !== id) }));
  },

  closeAll: () => {
    get().dialogs.forEach((d) => d.onClose?.());
    set({ dialogs: [] });
  },
}));

// Imperative API — callable outside React components
export const dialog = {
  open: (options: DialogOptions) => useDialogStore.getState().open(options),
  close: (id: string) => useDialogStore.getState().close(id),
  closeAll: () => useDialogStore.getState().closeAll(),
};
