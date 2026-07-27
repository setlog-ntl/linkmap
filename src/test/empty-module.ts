// vitest에서 `server-only`/`client-only` 마커 패키지를 no-op으로 대체하기 위한 스텁.
// 이 패키지들은 RSC 경계 강제를 위해 잘못된 환경에서 import되면 throw하도록 설계되어
// (crypto/index.ts, supabase/admin.ts의 server-only 가드 — 레드팀 F-13),
// jsdom 테스트 환경에서 그대로 두면 해당 모듈을 import하는 테스트가 로드 시 실패한다.
export {};
