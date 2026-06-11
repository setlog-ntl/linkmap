// 원클릭 템플릿 번들을 디스크로 추출 — 실제 배포 빌드(npm ci && next build)를 로컬에서 재현하기 위함.
// 사용: npx tsx scripts/materialize-template.ts <slug> <outDir>
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { getTemplateBySlug } from '../src/data/oneclick/homepage-template-content';

const slug = process.argv[2];
const outDir = process.argv[3];
if (!slug || !outDir) {
  console.error('usage: tsx scripts/materialize-template.ts <slug> <outDir>');
  process.exit(1);
}

const template = getTemplateBySlug(slug);
if (!template) {
  console.error(`template not found: ${slug}`);
  process.exit(1);
}

for (const f of template.files) {
  const p = join(outDir, f.path);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, f.content);
}
console.log(`[${slug}] wrote ${template.files.length} files → ${outDir}`);
