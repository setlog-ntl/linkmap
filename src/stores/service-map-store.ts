import { create } from 'zustand';
import type { ZoneKey } from '@/lib/layout/zone-layout';
import type { ViewLevel } from '@/types';

interface ContextMenuState {
  x: number;
  y: number;
  nodeId: string | null;
}

interface ServiceMapState {
  viewLevel: ViewLevel;
  catalogSidebarOpen: boolean;
  focusedNodeId: string | null;
  contextMenu: ContextMenuState | null;
  connectingFrom: string | null;

  editMode: boolean;
  pendingOverrides: Record<string, ZoneKey>;
  pendingMainServiceId: string | null | undefined;

  setViewLevel: (level: ViewLevel) => void;
  setCatalogSidebarOpen: (open: boolean) => void;
  toggleCatalogSidebar: () => void;
  setFocusedNodeId: (id: string | null) => void;
  setContextMenu: (menu: ContextMenuState | null) => void;
  setConnectingFrom: (id: string | null) => void;

  setEditMode: (mode: boolean) => void;
  setPendingOverride: (nodeId: string, zone: ZoneKey) => void;
  setPendingMainServiceId: (id: string | null) => void;
  clearPendingChanges: () => void;
  pendingChangeCount: () => number;
}

export const useServiceMapStore = create<ServiceMapState>((set, get) => ({
  viewLevel: 'status' as ViewLevel,
  catalogSidebarOpen: false,
  focusedNodeId: null,
  contextMenu: null,
  connectingFrom: null,

  editMode: false,
  pendingOverrides: {},
  pendingMainServiceId: undefined,

  setViewLevel: (level) => set({ viewLevel: level }),
  setCatalogSidebarOpen: (open) => set({ catalogSidebarOpen: open }),
  toggleCatalogSidebar: () => set((s) => ({ catalogSidebarOpen: !s.catalogSidebarOpen })),
  setFocusedNodeId: (id) => set((s) => ({ focusedNodeId: s.focusedNodeId === id ? null : id })),
  setContextMenu: (menu) => set({ contextMenu: menu }),
  setConnectingFrom: (id) => set({ connectingFrom: id }),

  setEditMode: (mode) => set({
    editMode: mode,
    ...(mode ? {} : { pendingOverrides: {}, pendingMainServiceId: undefined }),
  }),
  setPendingOverride: (nodeId, zone) => set((s) => ({
    pendingOverrides: { ...s.pendingOverrides, [nodeId]: zone },
  })),
  setPendingMainServiceId: (id) => set({ pendingMainServiceId: id }),
  clearPendingChanges: () => set({ pendingOverrides: {}, pendingMainServiceId: undefined }),
  pendingChangeCount: () => {
    const s = get();
    let count = Object.keys(s.pendingOverrides).length;
    if (s.pendingMainServiceId !== undefined) count += 1;
    return count;
  },
}));
