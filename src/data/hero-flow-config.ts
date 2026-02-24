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
  supabase:   { dx: -155, dy:  20 },
  firebase:   { dx:   15, dy:  20 },
  // ── Auth (좌측 세로, 70px 간격) ──
  google:     { dx: -360, dy:  85 },
  kakao:      { dx: -360, dy: 155 },
  naver:      { dx: -360, dy: 225 },
  // ── Center hub ──
  myapp:      { dx:  -80, dy: 145 },
  // ── AI (우측 상단, 70px 간격) ──
  openai:     { dx:  240, dy:  85 },
  gemini:     { dx:  240, dy: 155 },
  // ── Deploy (우측 하단, 70px 간격) ──
  vercel:     { dx:  240, dy: 255 },
  cloudflare: { dx:  240, dy: 325 },
  // ── GitHub (Deploy 그룹 내) ──
  github:     { dx:  240, dy: 395 },
};

// ── 그룹 색상 ──
export type GroupColorHint = 'green' | 'purple' | 'blue' | 'amber' | 'red' | 'cyan' | 'orange' | 'pink';

export interface GroupConfig {
  label: string;
  colorHint: GroupColorHint;
  /** 그룹에 속하는 서비스 노드 ID 목록 (바운딩 박스 자동 계산용) */
  members: string[];
}

export const GROUP_CONFIGS: Record<string, GroupConfig> = {
  'g-db':     { label: '🗄️ DATABASE', colorHint: 'amber',  members: ['supabase', 'firebase'] },
  'g-auth':   { label: '🔐 AUTH',     colorHint: 'green',  members: ['google', 'kakao', 'naver'] },
  'g-ai':     { label: '🤖 AI',       colorHint: 'purple', members: ['openai', 'gemini'] },
  'g-deploy': { label: '🚀 DEPLOY',   colorHint: 'blue',   members: ['vercel', 'cloudflare', 'github'] },
};

// ── 레이아웃 상수 ──
export const LAYOUT = {
  /** 그룹 내부 패딩 */
  groupPadding: 14,
  /** 그룹 기본 너비 */
  groupWidth: 190,
  /** 서비스 노드 대략 높이 */
  nodeHeight: 54,
};
