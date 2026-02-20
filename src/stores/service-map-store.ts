import { create } from 'zustand';

interface ContextMenuState {
  x: number;
  y: number;
  nodeId: string | null; // null = pane context menu
}

interface ServiceMapState {
  catalogSidebarOpen: boolean;
  focusedNodeId: string | null;
  contextMenu: ContextMenuState | null;
  connectingFrom: string | null;

  setCatalogSidebarOpen: (open: boolean) => void;
  toggleCatalogSidebar: () => void;
  setFocusedNodeId: (id: string | null) => void;
  setContextMenu: (menu: ContextMenuState | null) => void;
  setConnectingFrom: (id: string | null) => void;
}

export const useServiceMapStore = create<ServiceMapState>((set) => ({
  catalogSidebarOpen: false,
  focusedNodeId: null,
  contextMenu: null,
  connectingFrom: null,

  setCatalogSidebarOpen: (open) => set({ catalogSidebarOpen: open }),
  toggleCatalogSidebar: () => set((s) => ({ catalogSidebarOpen: !s.catalogSidebarOpen })),
  setFocusedNodeId: (id) => set((s) => ({ focusedNodeId: s.focusedNodeId === id ? null : id })),
  setContextMenu: (menu) => set({ contextMenu: menu }),
  setConnectingFrom: (id) => set({ connectingFrom: id }),
}));
