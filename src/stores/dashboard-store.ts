import { create } from 'zustand';
import type { DashboardLayer } from '@/types';

type MobileTab = DashboardLayer | 'project';

interface DashboardState {
  activeTab: MobileTab;
  expandedCardId: string | null;
  selectedConnectionId: string | null;
  setActiveTab: (tab: MobileTab) => void;
  toggleCard: (id: string) => void;
  setSelectedConnectionId: (id: string | null) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  activeTab: 'project',
  expandedCardId: null,
  selectedConnectionId: null,
  setActiveTab: (tab) => set({ activeTab: tab }),
  toggleCard: (id) =>
    set((state) => ({
      expandedCardId: state.expandedCardId === id ? null : id,
    })),
  setSelectedConnectionId: (id) => set({ selectedConnectionId: id }),
}));
