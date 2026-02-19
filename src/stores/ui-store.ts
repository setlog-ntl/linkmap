import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  commandOpen: boolean;
  aiCommandMode: boolean;
  setSidebarOpen: (open: boolean) => void;
  setCommandOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setAiCommandMode: (mode: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  commandOpen: false,
  aiCommandMode: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setCommandOpen: (open) => set({ commandOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setAiCommandMode: (mode) => set({ aiCommandMode: mode }),
}));
