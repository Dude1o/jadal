import { create } from "zustand";

export type ToastVariant = "default" | "success" | "error" | "warning" | "info";
export type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "left-center"
  | "center-center"
  | "right-center"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export interface ToastAction {
  label: string;
  onClick: () => void;
  variant?: "default" | "outline" | "ghost" | "destructive";
}

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number; // ms, 0 = persistent
  position?: ToastPosition;
  icon?: React.ReactNode;
  action?: ToastAction;
  closable?: boolean;
  onClose?: () => void;
}

export type ToastInput = Omit<Toast, "id">;

interface ToastStore {
  toasts: Toast[];
  defaultPosition: ToastPosition;
  defaultDuration: number;
  add: (toast: ToastInput) => string;
  remove: (id: string) => void;
  removeAll: () => void;
  setDefaultPosition: (position: ToastPosition) => void;
  setDefaultDuration: (duration: number) => void;
}

let counter = 0;

export const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],
  defaultPosition: "bottom-right",
  defaultDuration: 4000,

  add: (toast) => {
    const id = `toast-${++counter}`;
    const { defaultPosition, defaultDuration } = get();

    set((state) => ({
      toasts: [
        ...state.toasts,
        {
          closable: true,
          variant: "default",
          position: defaultPosition,
          duration: defaultDuration,
          ...toast,
          id,
        },
      ],
    }));

    return id;
  },

  remove: (id) => {
    const toast = get().toasts.find((t) => t.id === id);
    toast?.onClose?.();
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },

  removeAll: () => set({ toasts: [] }),

  setDefaultPosition: (position) => set({ defaultPosition: position }),
  setDefaultDuration: (duration) => set({ defaultDuration: duration }),
}));

// Convenience hook for imperative usage anywhere
export const toast = {
  show: (input: ToastInput) => useToastStore.getState().add(input),
  success: (title: string, opts?: Partial<ToastInput>) =>
    useToastStore.getState().add({ title, variant: "success", ...opts }),
  error: (title: string, opts?: Partial<ToastInput>) =>
    useToastStore.getState().add({ title, variant: "error", ...opts }),
  warning: (title: string, opts?: Partial<ToastInput>) =>
    useToastStore.getState().add({ title, variant: "warning", ...opts }),
  info: (title: string, opts?: Partial<ToastInput>) =>
    useToastStore.getState().add({ title, variant: "info", ...opts }),
  dismiss: (id: string) => useToastStore.getState().remove(id),
  dismissAll: () => useToastStore.getState().removeAll(),
};
