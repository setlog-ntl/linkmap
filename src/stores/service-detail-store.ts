import { create } from 'zustand';
import type { ProjectService, Service, ServiceDependency, EnvironmentVariable } from '@/types';

/** Full data payload — available when opened from service map views */
export interface ServiceDetailFullData {
  service: ProjectService & { service: Service };
  dependencies: ServiceDependency[];
  serviceNames: Record<string, string>;
  projectId: string;
  envVars: EnvironmentVariable[];
}

/** Lightweight identifier — used from dashboard where full data isn't available */
export interface ServiceDetailPendingId {
  projectServiceId: string;
  serviceId: string;
  projectId: string;
}

interface ServiceDetailState {
  /** Full data for the sheet (null = closed or pending) */
  fullData: ServiceDetailFullData | null;
  /** Pending identifier waiting for data resolution */
  pendingIdentifier: ServiceDetailPendingId | null;
  /** Whether sheet is open */
  isOpen: boolean;

  /** Open with full data (from service map views) */
  openSheet: (data: ServiceDetailFullData) => void;
  /** Open with just IDs (from dashboard — resolver will fetch full data) */
  openSheetById: (id: ServiceDetailPendingId) => void;
  /** Resolve pending identifier with fetched full data */
  resolvePending: (data: ServiceDetailFullData) => void;
  /** Close the sheet */
  closeSheet: () => void;
}

export const useServiceDetailStore = create<ServiceDetailState>((set) => ({
  fullData: null,
  pendingIdentifier: null,
  isOpen: false,

  openSheet: (data) =>
    set({ fullData: data, pendingIdentifier: null, isOpen: true }),

  openSheetById: (id) =>
    set({ fullData: null, pendingIdentifier: id, isOpen: true }),

  resolvePending: (data) =>
    set((s) => (s.pendingIdentifier ? { fullData: data, pendingIdentifier: null } : s)),

  closeSheet: () =>
    set({ fullData: null, pendingIdentifier: null, isOpen: false }),
}));
