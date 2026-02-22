import { create } from 'zustand';

interface Position {
  x: number;
  y: number;
}

interface Size {
  width: number;
  height: number;
}

interface AiChatState {
  isOpen: boolean;
  position: Position | null;
  size: Size | null;
  isMaximized: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  setPosition: (pos: Position) => void;
  setSize: (size: Size) => void;
  toggleMaximize: () => void;
}

export const PANEL_MIN_WIDTH = 360;
export const PANEL_MIN_HEIGHT = 400;
export const PANEL_DEFAULT_WIDTH = 440;
export const PANEL_DEFAULT_HEIGHT = 560;
export const PANEL_MAX_WIDTH = 800;
export const PANEL_MAX_HEIGHT_LIMIT = 900;

export const useAiChatStore = create<AiChatState>((set) => ({
  isOpen: false,
  position: null,
  size: null,
  isMaximized: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
  setPosition: (position) => set({ position }),
  setSize: (size) => set({ size }),
  toggleMaximize: () => set((s) => ({ isMaximized: !s.isMaximized })),
}));
