// ──────────────────────────────────────────────
// 원클릭 템플릿 lockfile 검증 (CI)
//
// 배포 시 GitHub Actions가 `npm ci`를 실행한다. lockfile이 package.json과
// 어긋나면 신규 배포가 전부 빌드 실패하므로, 커밋된 lockfile 자산으로 실제
// `npm ci`가 성공하는지 변형별로 증명한다. (네트워크 필요 — CI 환경 전제)
//
// 오프라인 정합성(package.json ↔ lockfile)은 template-deps.test.ts가 1차로 강제하고,
// 본 스크립트는 "배포 시점 npm ci가 실제로 통과하는가"를 확정한다.
//
// 실행: node scripts/verify-template-lockfiles.mjs
// ──────────────────────────────────────────────

import { execSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync, copyFileSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { VARIANTS, buildPackageJson } from './lib/template-deps.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const LOCKS_DIR = join(__dirname, '..', 'src', 'data', 'oneclick', 'locks');

let failed = false;

function verify(variant) {
  const lockPath = join(LOCKS_DIR, `${variant}.lock.json`);
  if (!existsSync(lockPath)) {
    console.error(`❌ [${variant}] lockfile 자산 없음: ${lockPath} — gen-template-lockfiles.mjs 실행 필요`);
    failed = true;
    return;
  }

  const tmp = mkdtempSync(join(tmpdir(), `linkmap-verify-${variant}-`));
  try {
    // 자산의 name(linkmap-template)과 일치하는 정규 package.json 작성
    writeFileSync(
      join(tmp, 'package.json'),
      JSON.stringify(buildPackageJson(variant), null, 2) + '\n',
    );
    copyFileSync(lockPath, join(tmp, 'package-lock.json'));

    // npm ci가 통과하면 lockfile이 package.json과 정합하며 해석 가능
    execSync('npm ci --ignore-scripts --no-audit --no-fund', {
      cwd: tmp,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    const lock = JSON.parse(readFileSync(lockPath, 'utf-8'));
    console.log(`✅ [${variant}] npm ci 통과 (lockfileVersion ${lock.lockfileVersion}, packages ${Object.keys(lock.packages ?? {}).length})`);
  } catch (err) {
    console.error(`❌ [${variant}] npm ci 실패 — lockfile 재생성 필요 (node scripts/gen-template-lockfiles.mjs)`);
    if (err.stderr) console.error(String(err.stderr));
    failed = true;
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

for (const variant of Object.keys(VARIANTS)) {
  verify(variant);
}

if (failed) {
  console.error('\n원클릭 템플릿 lockfile 검증 실패.');
  process.exit(1);
}
console.log('\n✅ 모든 변형 lockfile 검증 완료');
