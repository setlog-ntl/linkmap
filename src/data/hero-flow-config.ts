/**
 * Hero Flow 레이아웃 & 색상 설정
 *
 * 이 파일의 값을 수정하면 랜딩 페이지 히어로 Flow에 즉시 반영됩니다.
 * HTML 에디터(docs/tools/hero-flow-editor.html)에서 시각적으로 조정 후
 * 출력된 JSON을 여기에 붙여넣으세요.
 */

// ── 노드 위치 (cx 기준 오프셋) ──
// cx = 화면 가로 중앙. 각 값은 { dx, dy } 로 cx 기준 상대좌표.
// 예: dx: -140 → cx에서 왼쪽 140px
export interface NodeOffset {
  dx: number;
  dy: number;
}

export const NODE_OFFSETS: Record<string, NodeOffset> = {
  // ── Database (상단 가로 배치) ──
  supabase:   { dx: -155, dy:  28 },
  firebase:   { dx:   15, dy:  28 },
  // ── Auth (좌측 세로, 70px 간격) ──
  google:     { dx: -370, dy: 100 },
  kakao:      { dx: -370, dy: 170 },
  naver:      { dx: -370, dy: 240 },
  // ── Center hub ──
  myapp:      { dx:  -80, dy: 165 },
  // ── AI (우측 상단, 70px 간격) ──
  openai:     { dx:  250, dy: 100 },
  gemini:     { dx:  250, dy: 170 },
  // ── Deploy (우측 하단, 70px 간격) ──
  vercel:     { dx:  250, dy: 270 },
  cloudflare: { dx:  250, dy: 340 },
  // ── GitHub CI/CD (중앙 하단, myapp 아래) ──
  github:     { dx:  -80, dy: 305 },
};

// ── 그룹 색상 ──
export type GroupColorHint = 'green' | 'purple' | 'blue' | 'amber' | 'red' | 'cyan' | 'orange' | 'pink' | 'outer';

export interface GroupConfig {
  label: string;
  colorHint: GroupColorHint;
  /** 그룹에 속하는 서비스 노드 ID 목록 (바운딩 박스 자동 계산용) */
  members: string[];
}

export const GROUP_CONFIGS: Record<string, GroupConfig> = {
  // 전체를 감싸는 단일 외부 박스 — 내부 개별 박스 없음
  'g-outer': {
    label: '',
    colorHint: 'outer',
    members: ['supabase', 'firebase', 'google', 'kakao', 'naver', 'openai', 'gemini', 'vercel', 'cloudflare', 'github'],
  },
};

// ── 섹션 레이블 위치 (cx 기준 오프셋) — 텍스트 노드용 ──
export interface LabelOffset {
  dx: number;
  dy: number;
  text: string;
  colorHint: Exclude<GroupColorHint, 'outer'>;
}

export const SECTION_LABELS: LabelOffset[] = [
  { dx: -155, dy:  12, text: 'DATABASE',  colorHint: 'amber'  },
  { dx: -370, dy:  84, text: 'AUTH',      colorHint: 'green'  },
  { dx:  250, dy:  84, text: 'AI',        colorHint: 'purple' },
  { dx:  250, dy: 254, text: 'DEPLOY',    colorHint: 'blue'   },
  { dx:  -80, dy: 289, text: 'CI/CD',     colorHint: 'orange' },
];

// ── 레이아웃 상수 ──
export const LAYOUT = {
  /** 외부 그룹 내부 패딩 */
  groupPadding: 28,
  /** 그룹 기본 너비 */
  groupWidth: 190,
  /** 서비스 노드 대략 높이 */
  nodeHeight: 54,
};
