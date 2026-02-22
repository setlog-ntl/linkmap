#!/usr/bin/env node
/**
 * 랜딩 페이지 관련 소스 코드만 모아서 확인할 수 있게 해주는 스크립트
 *
 * 사용법:
 *   node scripts/export-landing-code.js           → 목록만 콘솔 출력
 *   node scripts/export-landing-code.js --copy    → docs/landing-code-snapshot/ 에 복사
 *   node scripts/export-landing-code.js --list    → docs/landing-files.txt 에 경로 목록 저장
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// 랜딩 페이지를 구성하는 파일 목록 (src 기준)
const LANDING_FILES = [
  'src/app/page.tsx',
  'src/components/layout/header.tsx',
  'src/components/layout/footer.tsx',
  'src/components/landing/hero-section.tsx',
  'src/components/landing/stats-section.tsx',
  'src/components/landing/features-bento.tsx',
  'src/components/landing/ai-features-section.tsx',
  'src/components/landing/how-it-works.tsx',
  'src/components/landing/services-grid.tsx',
  'src/components/landing/oneclick-deploy-section.tsx',
  'src/components/landing/cta-section.tsx',
  'src/components/landing/testimonials-section.tsx',
  'src/components/landing/flow-architecture-diagram.tsx',
  'src/components/landing/flow-comparison.tsx',
  'src/components/landing/connection-dashboard.tsx',
  'src/components/landing/flow-layer-node.tsx',
  'src/components/landing/status-badge.tsx',
  'src/components/landing/interactive-demo.tsx',
];

function listAll() {
  const existing = [];
  const missing = [];
  for (const file of LANDING_FILES) {
    const full = path.join(ROOT, file);
    if (fs.existsSync(full)) existing.push(file);
    else missing.push(file);
  }
  return { existing, missing };
}

function run() {
  const copy = process.argv.includes('--copy');
  const list = process.argv.includes('--list');
  const { existing, missing } = listAll();

  if (missing.length) {
    console.log('(일부 파일 없음:', missing.join(', '), ')\n');
  }

  if (list) {
    const outPath = path.join(ROOT, 'docs', 'landing-files.txt');
    const dir = path.dirname(outPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const content = [
      '# 랜딩 페이지 관련 소스 파일 목록',
      '# 생성: node scripts/export-landing-code.js --list',
      '',
      ...existing,
    ].join('\n');
    fs.writeFileSync(outPath, content, 'utf8');
    console.log('Wrote', outPath);
    return;
  }

  if (copy) {
    const destDir = path.join(ROOT, 'docs', 'landing-code-snapshot');
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
    const indexLines = ['# 랜딩 페이지 코드 스냅샷\n', '아래 경로에 해당 파일들이 복사되어 있습니다.\n', ''];
    for (const file of existing) {
      const src = path.join(ROOT, file);
      const dest = path.join(destDir, file);
      const destDirPath = path.dirname(dest);
      if (!fs.existsSync(destDirPath)) fs.mkdirSync(destDirPath, { recursive: true });
      fs.copyFileSync(src, dest);
      indexLines.push(`- ${file}`);
    }
    const readme = path.join(destDir, 'README.md');
    fs.writeFileSync(readme, indexLines.join('\n'), 'utf8');
    console.log('Copied', existing.length, 'files to docs/landing-code-snapshot/');
    return;
  }

  // 기본: 콘솔에 목록만 출력
  console.log('랜딩 페이지 관련 파일 (' + existing.length + '개)\n');
  existing.forEach((f) => console.log('  ', f));
  console.log('\n옵션: --copy  → docs/landing-code-snapshot/ 에 복사');
  console.log('      --list  → docs/landing-files.txt 에 경로 목록 저장');
}

run();
