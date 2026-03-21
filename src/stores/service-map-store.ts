import { create } from 'zustand';
import { DEFAULT_ZONES, type ZoneConfig, type LayoutPreset, type ZoneKey } from '@/lib/layout/zone-layout';
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

/** Zone-level connection (visual edge between zone nodes) */
export interface ZoneConnection {
  id: string;
  source: string;   // zone-{key} or service node id
  target: string;   // zone-{key} or service node id
  connectionType: string;
  label?: string;
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
  pendingNodePositions: Record<string, { x: number; y: number }>;

  // Zone customization
  zoneConfigs: ZoneConfig[];
  layoutPreset: LayoutPreset;
  zonePositionOverrides: Record<string, { x: number; y: number }>;
  zoneSizeOverrides: Record<string, { width: number; height: number }>;

  // Hover state for edge↔node cross-highlighting
  hoveredEdgeId: string | null;
  hoveredEdgeNodes: HoveredEdgeNodes | null;
  hoveredNodeId: string | null;

  // Drag-to-zone: zone highlighted as drop target during service node drag
  dragTargetZoneKey: string | null;

  // Zone-level connections (visual edges between zones/zone↔node)
  zoneConnections: ZoneConnection[];

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
  setPendingNodePosition: (nodeId: string, pos: { x: number; y: number }) => void;
  clearPendingChanges: () => void;
  pendingChangeCount: () => number;

  // Zone customization
  setZoneConfigs: (configs: ZoneConfig[]) => void;
  addZone: (zone: ZoneConfig) => void;
  removeZone: (key: string) => void;
  updateZone: (key: string, updates: Partial<ZoneConfig>) => void;
  setLayoutPreset: (preset: LayoutPreset) => void;
  setZonePositionOverride: (zoneId: string, pos: { x: number; y: number }) => void;
  setZoneSizeOverride: (zoneId: string, size: { width: number; height: number }) => void;
  resetZoneLayout: () => void;
  getActiveZones: () => ZoneConfig[];

  // Zone connections
  addZoneConnection: (conn: ZoneConnection) => void;
  removeZoneConnection: (id: string) => void;

  // Hover cross-highlighting
  setHoveredEdge: (id: string | null, nodes?: HoveredEdgeNodes) => void;
  setHoveredNodeId: (id: string | null) => void;
  setDragTargetZoneKey: (key: string | null) => void;

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
  pendingNodePositions: {},

  // Zone customization defaults
  zoneConfigs: [],  // empty = use DEFAULT_ZONES
  layoutPreset: 'horizontal',
  zonePositionOverrides: {},
  zoneSizeOverrides: {},

  hoveredEdgeId: null,
  hoveredEdgeNodes: null,
  hoveredNodeId: null,
  dragTargetZoneKey: null,
  zoneConnections: [],

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
    ...(mode ? {} : { pendingOverrides: {}, pendingMainServiceId: undefined, pendingNodePositions: {} }),
  }),
  setPendingOverride: (nodeId, zone) => set((s) => ({
    pendingOverrides: { ...s.pendingOverrides, [nodeId]: zone },
  })),
  setPendingMainServiceId: (id) => set({ pendingMainServiceId: id }),
  setPendingNodePosition: (nodeId, pos) => set((s) => ({
    pendingNodePositions: { ...s.pendingNodePositions, [nodeId]: pos },
  })),
  clearPendingChanges: () => set({ pendingOverrides: {}, pendingMainServiceId: undefined, pendingNodePositions: {} }),
  pendingChangeCount: () => {
    const s = get();
    const overrideIds = new Set(Object.keys(s.pendingOverrides));
    const positionIds = new Set(Object.keys(s.pendingNodePositions));
    // Merge unique node IDs (some nodes have both zone + position changes)
    const uniqueIds = new Set([...overrideIds, ...positionIds]);
    let count = uniqueIds.size;
    if (s.pendingMainServiceId !== undefined) count += 1;
    return count;
  },

  // Zone customization
  setZoneConfigs: (configs) => set({ zoneConfigs: configs }),
  addZone: (zone) => set((s) => {
    const base = s.zoneConfigs.length > 0 ? s.zoneConfigs : [...DEFAULT_ZONES];
    return { zoneConfigs: [...base, zone] };
  }),
  removeZone: (key) => set((s) => {
    const base = s.zoneConfigs.length > 0 ? s.zoneConfigs : [...DEFAULT_ZONES];
    const updated = base.filter((z) => z.key !== key);
    // Clear position/size overrides for removed zone
    const { [`zone-${key}`]: _p, ...posRest } = s.zonePositionOverrides;
    const { [`zone-${key}`]: _s, ...sizeRest } = s.zoneSizeOverrides;
    return { zoneConfigs: updated, zonePositionOverrides: posRest, zoneSizeOverrides: sizeRest };
  }),
  updateZone: (key, updates) => set((s) => {
    const base = s.zoneConfigs.length > 0 ? s.zoneConfigs : [...DEFAULT_ZONES];
    return {
      zoneConfigs: base.map((z) => (z.key === key ? { ...z, ...updates } : z)),
    };
  }),
  setLayoutPreset: (preset) => set({
    layoutPreset: preset,
    zonePositionOverrides: {},  // Reset positions when changing preset
  }),
  setZonePositionOverride: (zoneId, pos) => set((s) => ({
    zonePositionOverrides: { ...s.zonePositionOverrides, [zoneId]: pos },
  })),
  setZoneSizeOverride: (zoneId, size) => set((s) => ({
    zoneSizeOverrides: { ...s.zoneSizeOverrides, [zoneId]: size },
  })),
  resetZoneLayout: () => set({
    zonePositionOverrides: {},
    zoneSizeOverrides: {},
    layoutPreset: 'horizontal',
  }),
  getActiveZones: () => {
    const s = get();
    return s.zoneConfigs.length > 0 ? s.zoneConfigs : DEFAULT_ZONES;
  },

  // Zone connections
  addZoneConnection: (conn) => set((s) => ({
    zoneConnections: [...s.zoneConnections, conn],
  })),
  removeZoneConnection: (id) => set((s) => ({
    zoneConnections: s.zoneConnections.filter((c) => c.id !== id),
  })),

  // Hover cross-highlighting
  setHoveredEdge: (id, nodes) => set({
    hoveredEdgeId: id,
    hoveredEdgeNodes: id && nodes ? nodes : null,
  }),
  setHoveredNodeId: (id) => set({ hoveredNodeId: id }),
  setDragTargetZoneKey: (key) => set({ dragTargetZoneKey: key }),

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
    redoStack: [],
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
