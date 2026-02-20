// ──────────────────────────────────────────────
// Module Schema — 모듈형 템플릿 에디터 타입 정의
// ──────────────────────────────────────────────

/** 폼 필드 하나의 정의 */
export interface ModuleFieldDef {
  key: string;
  type:
    | 'text'
    | 'textarea'
    | 'color'
    | 'number'
    | 'boolean'
    | 'select'
    | 'url'
    | 'array';
  label: string;
  labelEn?: string;
  placeholder?: string;
  defaultValue: unknown;
  validation?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
  };
  /** array 타입 전용 — 배열 요소의 필드 정의 */
  itemSchema?: ModuleFieldDef[];
  maxItems?: number;
  /** select 타입 전용 */
  options?: Array<{ value: string; label: string }>;
}

/** 모듈 하나의 정의 */
export interface ModuleDef {
  id: string;
  name: string;
  nameEn?: string;
  /** lucide-react 아이콘 이름 */
  icon: string;
  description: string;
  descriptionEn?: string;
  category: 'content' | 'layout';
  /** true이면 비활성화 불가 */
  required: boolean;
  defaultEnabled: boolean;
  fields: ModuleFieldDef[];
  /** 변경 시 영향받는 파일 경로 목록 */
  affectedFiles: string[];
}

/** 템플릿 전체의 모듈 스키마 */
export interface TemplateModuleSchema {
  templateSlug: string;
  modules: ModuleDef[];
  /** 모듈 ID의 기본 표시 순서 */
  defaultOrder: string[];
}

/** 런타임 모듈 설정 상태 (사용자가 편집한 값) */
export interface ModuleConfigState {
  /** 모듈별 설정값 */
  values: Record<string, Record<string, unknown>>;
  /** 활성화된 모듈 ID 목록 */
  enabled: string[];
  /** 모듈 표시 순서 */
  order: string[];
}
