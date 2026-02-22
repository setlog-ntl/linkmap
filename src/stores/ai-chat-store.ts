import { create } from 'zustand';

interface Position {
  x: number;
  y: number;
}

interface AiChatState {
  isOpen: boolean;
  position: Position | null;
  open: () => void;
  close: () => void;
  toggle: () => void;
  setPosition: (pos: Position) => void;
}

export const useAiChatStore = create<AiChatState>((set) => ({
  isOpen: false,
  position: null,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
  setPosition: (position) => set({ position }),
}));
