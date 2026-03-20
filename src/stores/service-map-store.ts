import { create } from 'zustand';
import type { ZoneKey } from '@/lib/layout/zone-layout';
import type { ViewLevel } from '@/types';

interface ContextMenuState {
  x: number;
  y: number;
  nodeId: string | null;
}

export interface HoveredEdgeNodes {
  source: string;
  target: string;
}

/** Undo/Redo history entry for connection operations */
interface HistoryEntry {
  type: 'connection_create' | 'connection_delete' | 'connection_type_change';
  data: Record<string, unknown>;
  timestamp: number;
}

const MAX_HISTORY = 50;

interface ServiceMapState {
  viewLevel: ViewLevel;
  catalogSidebarOpen: boolean;
  focusedNodeId: string | null;
  contextMenu: ContextMenuState | null;
  connectingFrom: string | null;
  filterStatuses: string[];

  editMode: boolean;
  pendingOverrides: Record<string, ZoneKey>;
  pendingMainServiceId: string | null | undefined;

  // Hover state for edge↔node cross-highlighting
  hoveredEdgeId: string | null;
  hoveredEdgeNodes: HoveredEdgeNodes | null;
  hoveredNodeId: string | null;

  // Multi-select support
  selectedNodeIds: Set<string>;

  // Undo/Redo history
  undoStack: HistoryEntry[];
  redoStack: HistoryEntry[];

  setViewLevel: (level: ViewLevel) => void;
  setCatalogSidebarOpen: (open: boolean) => void;
  toggleCatalogSidebar: () => void;
  setFocusedNodeId: (id: string | null) => void;
  setContextMenu: (menu: ContextMenuState | null) => void;
  setConnectingFrom: (id: string | null) => void;
  toggleFilterStatus: (status: string) => void;

  setEditMode: (mode: boolean) => void;
  setPendingOverride: (nodeId: string, zone: ZoneKey) => void;
  setPendingMainServiceId: (id: string | null) => void;
  clearPendingChanges: () => void;
  pendingChangeCount: () => number;

  // Hover cross-highlighting
  setHoveredEdge: (id: string | null, nodes?: HoveredEdgeNodes) => void;
  setHoveredNodeId: (id: string | null) => void;

  // Multi-select
  toggleNodeSelection: (nodeId: string) => void;
  clearSelection: () => void;
  isNodeSelected: (nodeId: string) => boolean;

  // Undo/Redo
  pushHistory: (entry: Omit<HistoryEntry, 'timestamp'>) => void;
  undo: () => HistoryEntry | undefined;
  redo: () => HistoryEntry | undefined;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

export const useServiceMapStore = create<ServiceMapState>((set, get) => ({
  viewLevel: 'map' as ViewLevel,
  catalogSidebarOpen: false,
  focusedNodeId: null,
  contextMenu: null,
  connectingFrom: null,
  filterStatuses: [],

  editMode: false,
  pendingOverrides: {},
  pendingMainServiceId: undefined,

  hoveredEdgeId: null,
  hoveredEdgeNodes: null,
  hoveredNodeId: null,

  selectedNodeIds: new Set(),
  undoStack: [],
  redoStack: [],

  setViewLevel: (level) => set({ viewLevel: level }),
  setCatalogSidebarOpen: (open) => set({ catalogSidebarOpen: open }),
  toggleCatalogSidebar: () => set((s) => ({ catalogSidebarOpen: !s.catalogSidebarOpen })),
  setFocusedNodeId: (id) => set((s) => ({ focusedNodeId: s.focusedNodeId === id ? null : id })),
  setContextMenu: (menu) => set({ contextMenu: menu }),
  setConnectingFrom: (id) => set({ connectingFrom: id }),
  toggleFilterStatus: (status) => set((s) => ({
    filterStatuses: s.filterStatuses.includes(status)
      ? s.filterStatuses.filter((st) => st !== status)
      : [...s.filterStatuses, status],
  })),

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

  // Hover cross-highlighting
  setHoveredEdge: (id, nodes) => set({
    hoveredEdgeId: id,
    hoveredEdgeNodes: id && nodes ? nodes : null,
  }),
  setHoveredNodeId: (id) => set({ hoveredNodeId: id }),

  // Multi-select
  toggleNodeSelection: (nodeId) => set((s) => {
    const next = new Set(s.selectedNodeIds);
    if (next.has(nodeId)) {
      next.delete(nodeId);
    } else {
      next.add(nodeId);
    }
    return { selectedNodeIds: next };
  }),
  clearSelection: () => set({ selectedNodeIds: new Set() }),
  isNodeSelected: (nodeId) => get().selectedNodeIds.has(nodeId),

  // Undo/Redo
  pushHistory: (entry) => set((s) => ({
    undoStack: [...s.undoStack.slice(-(MAX_HISTORY - 1)), { ...entry, timestamp: Date.now() }],
    redoStack: [], // Clear redo on new action
  })),
  undo: () => {
    const s = get();
    if (s.undoStack.length === 0) return undefined;
    const entry = s.undoStack[s.undoStack.length - 1];
    set({
      undoStack: s.undoStack.slice(0, -1),
      redoStack: [...s.redoStack, entry],
    });
    return entry;
  },
  redo: () => {
    const s = get();
    if (s.redoStack.length === 0) return undefined;
    const entry = s.redoStack[s.redoStack.length - 1];
    set({
      redoStack: s.redoStack.slice(0, -1),
      undoStack: [...s.undoStack, entry],
    });
    return entry;
  },
  canUndo: () => get().undoStack.length > 0,
  canRedo: () => get().redoStack.length > 0,
}));
