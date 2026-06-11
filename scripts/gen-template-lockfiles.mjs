// ──────────────────────────────────────────────
// 원클릭 템플릿 lockfile 생성기
//
// 배포되는 사이트가 `npm ci`로 재현 가능한 빌드를 하려면 package.json과 정확히
// 일치하는 package-lock.json이 번들에 포함돼야 한다. 의존성 세트는 2종:
//   - standard: makePackageJson() 표준 (link-card 등 7개 템플릿)
//   - namecard:  standard + qrcode.react (digital-namecard 전용)
//
// 각 세트의 정규 package.json을 temp 디렉터리에 쓰고
// `npm install --package-lock-only`로 트리를 해석해 lockfile을 저장한다.
// 저장된 lockfile은 makePackageLock(name, variant)이 런타임에 name만 주입해 사용.
//
// 실행: node scripts/gen-template-lockfiles.mjs
// 검증: node scripts/verify-template-lockfiles.mjs (CI에서 npm ci 성공 확인)
// ──────────────────────────────────────────────

import { execSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync, mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { VARIANTS, buildPackageJson } from './lib/template-deps.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const LOCKS_DIR = join(__dirname, '..', 'src', 'data', 'oneclick', 'locks');

function genLockfile(variant) {
  const tmp = mkdtempSync(join(tmpdir(), `linkmap-lock-${variant}-`));
  try {
    writeFileSync(
      join(tmp, 'package.json'),
      JSON.stringify(buildPackageJson(variant), null, 2) + '\n',
    );
    console.log(`[${variant}] npm 의존성 해석 중...`);
    execSync('npm install --package-lock-only --ignore-scripts --no-audit --no-fund', {
      cwd: tmp,
      stdio: ['ignore', 'inherit', 'inherit'],
    });
    const lock = JSON.parse(readFileSync(join(tmp, 'package-lock.json'), 'utf-8'));
    const outPath = join(LOCKS_DIR, `${variant}.lock.json`);
    writeFileSync(outPath, JSON.stringify(lock, null, 2) + '\n');
    console.log(`[${variant}] → ${outPath} (lockfileVersion ${lock.lockfileVersion})`);
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

mkdirSync(LOCKS_DIR, { recursive: true });
for (const variant of Object.keys(VARIANTS)) {
  genLockfile(variant);
}
console.log('✅ lockfile 생성 완료');
