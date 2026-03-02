import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  sidebarOpen: boolean;
  commandOpen: boolean;
  sidebarCollapsed: boolean;
  tourEnabled: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setCommandOpen: (open: boolean) => void;
  toggleSidebarCollapsed: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setTourEnabled: (v: boolean) => void;
  toggleTourEnabled: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: false,
      commandOpen: false,
      sidebarCollapsed: false,
      tourEnabled: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setCommandOpen: (open) => set({ commandOpen: open }),
      toggleSidebarCollapsed: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      setTourEnabled: (v) => set({ tourEnabled: v }),
      toggleTourEnabled: () => set((state) => ({ tourEnabled: !state.tourEnabled })),
    }),
    {
      name: 'linkmap-ui',
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        tourEnabled: state.tourEnabled,
      }),
    }
  )
);
