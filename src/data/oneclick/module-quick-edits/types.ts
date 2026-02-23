export interface QuickEditQuestion {
  id: string;
  label: string;
  emoji: string;
  systemHint: string;
  targetModuleId: string;
  targetFields: string[];
}
