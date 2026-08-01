import { esc, getVal, getActiveModules, wrapInHtml, withSectionId } from './base';
import type { ModuleConfigState } from '@/lib/module-schema';

// ──────────────────────────────────────────────
// Excel Merge Preview — 배포 결과와 시각적으로 대응
// 도구 자체는 실제 파일을 다루므로 프리뷰에서는 정적 목업으로 보여 준다
// ──────────────────────────────────────────────

function buildCss(accent: string, isDark: boolean): string {
  const bg = isDark ? '#0b1220' : '#ffffff';
  const ink = isDark ? '#e2e8f0' : '#0f172a';
  const line = isDark ? 'rgba(255,255,255,.16)' : 'rgba(0,0,0,.12)';
  const soft = isDark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.05)';

  return `
:root { --em-accent: ${accent}; }
* { box-sizing: border-box; }
body { margin:0; background:${bg}; color:${ink};
  font-family:'Pretendard Variable','Pretendard',-apple-system,BlinkMacSystemFont,system-ui,sans-serif;
  line-height:1.7; -webkit-font-smoothing:antialiased; }
.em-wrap { max-width: 760px; margin: 0 auto; padding: 0 16px; }
.em-hero { text-align:center; padding: 56px 16px 8px; }
.em-badge { display:inline-flex; align-items:center; gap:6px; border-radius:999px;
  padding:5px 12px; font-size:12px; font-weight:700;
  background:${accent}1f; color:${accent}; }
.em-title { font-size:30px; font-weight:800; line-height:1.35; margin:14px 0 0; }
.em-sub { margin:10px auto 0; max-width:520px; font-size:15px; opacity:.75; }
.em-safe { display:inline-flex; align-items:center; gap:6px; margin-top:18px;
  border-radius:8px; padding:6px 12px; font-size:12px; background:${soft}; }
.em-drop { margin:28px 0 0; border:2px dashed ${line}; border-radius:16px;
  padding:40px 20px; text-align:center; }
.em-drop b { display:block; font-size:16px; }
.em-drop span { display:block; margin-top:6px; font-size:13px; opacity:.7; }
.em-note { margin-top:12px; text-align:center; font-size:12px; opacity:.7; }
.em-save { margin-top:16px; border:1px solid ${line}; border-radius:12px;
  padding:16px; text-align:center; }
.em-save .b { display:inline-flex; align-items:center; gap:6px; border-radius:12px;
  border:1px solid ${accent}; color:${accent}; padding:8px 16px;
  font-size:13px; font-weight:700; }
.em-save p { margin:8px 0 0; font-size:12px; opacity:.7; }
.em-rows { margin-top:22px; border:1px solid ${line}; border-radius:12px; overflow:hidden; }
.em-row { display:flex; gap:10px; align-items:center; padding:10px 14px; font-size:13px;
  border-top:1px solid ${line}; }
.em-row:first-child { border-top:none; }
.em-row .n { margin-left:auto; opacity:.65; font-size:12px; }
.em-cta { display:flex; align-items:center; gap:12px; margin-top:20px; flex-wrap:wrap; }
.em-cta .sum { font-size:14px; font-weight:700; }
.em-btn { margin-left:auto; border:none; border-radius:12px; padding:10px 20px;
  font-size:14px; font-weight:700; color:#fff; background:${accent}; }
.em-guide { padding: 40px 0 8px; }
.em-guide h2 { font-size:18px; font-weight:800; margin:0 0 16px; }
.em-steps { display:grid; gap:12px; grid-template-columns:repeat(3,1fr); margin:0; padding:0; list-style:none; }
.em-step { border:1px solid ${line}; border-radius:12px; padding:14px; font-size:13px; }
.em-step i { display:inline-flex; width:24px; height:24px; margin-bottom:8px;
  align-items:center; justify-content:center; border-radius:999px;
  background:${accent}; color:#fff; font-size:12px; font-weight:800; font-style:normal; }
.em-step p { margin:0; opacity:.8; }
.em-foot { padding: 32px 0 48px; text-align:center; font-size:12px; opacity:.55; }
@media (max-width: 560px) { .em-steps { grid-template-columns:1fr; } }
`;
}

export function generateExcelMergePreview(
  state: ModuleConfigState,
  _liveUrl: string,
  _imageMap: Record<string, string>,
): string {
  const accent = getVal(state, 'theme', 'accent', '#0f766e');
  const bgStyle = getVal(state, 'theme', 'bgStyle', 'light');
  const isDark = bgStyle === 'dark';
  const active = getActiveModules(state);

  const parts: string[] = [];

  if (active.includes('hero')) {
    const badge = getVal(state, 'hero', 'badge', '');
    const title = getVal(state, 'hero', 'title', '엑셀 취합기');
    const subtitle = getVal(state, 'hero', 'subtitle', '');
    parts.push(
      withSectionId(
        `<header class="em-hero">
  ${badge ? `<span class="em-badge">✦ ${esc(badge)}</span>` : ''}
  <h1 class="em-title">${esc(title)}</h1>
  ${subtitle ? `<p class="em-sub">${esc(subtitle)}</p>` : ''}
  <p class="em-safe">🛡 업로드 없음 · 설치 없음 · 브라우저 안에서 처리</p>
</header>`,
        'hero',
      ),
    );
  }

  if (active.includes('tool')) {
    const col = getVal(state, 'tool', 'fileNameColumn', '');
    const name = getVal(state, 'tool', 'downloadName', '취합결과');
    parts.push(
      withSectionId(
        `<section class="em-wrap">
  <div class="em-drop">
    <b>엑셀 파일을 여기에 끌어다 놓으세요</b>
    <span>.xlsx · .xls · .csv — 여러 개를 한 번에 올릴 수 있습니다</span>
  </div>
  <p class="em-note">🛡 파일은 이 브라우저 안에서만 처리됩니다. 어디에도 올라가지 않습니다.</p>
  <div class="em-save">
    <span class="b">💾 이 도구를 내 컴퓨터에 저장</span>
    <p>파일 하나로 저장됩니다. 인터넷이 없어도, 외부 연결이 막힌 회사 PC에서도 열립니다.</p>
  </div>
  <div class="em-rows">
    <div class="em-row">📄 <span>1월_영업1팀.xlsx</span><span class="n">128행</span></div>
    <div class="em-row">📄 <span>1월_영업2팀.xlsx</span><span class="n">96행</span></div>
    <div class="em-row">📄 <span>1월_해외팀.xlsx</span><span class="n">54행</span></div>
  </div>
  <div class="em-cta">
    <p class="sum">파일 3개 · 278행${col ? ` · 출처 열 “${esc(col)}” 포함` : ''}</p>
    <button class="em-btn" type="button">${esc(name)}.xlsx 내려받기</button>
  </div>
</section>`,
        'tool',
      ),
    );
  }

  if (active.includes('guide')) {
    const heading = getVal(state, 'guide', 'heading', '쓰는 방법');
    const steps = [
      getVal(state, 'guide', 'stepOne', ''),
      getVal(state, 'guide', 'stepTwo', ''),
      getVal(state, 'guide', 'stepThree', ''),
    ].filter(Boolean);
    if (steps.length > 0) {
      parts.push(
        withSectionId(
          `<section class="em-wrap em-guide">
  <h2>${esc(heading)}</h2>
  <ol class="em-steps">
${steps.map((s, i) => `    <li class="em-step"><i>${i + 1}</i><p>${esc(s)}</p></li>`).join('\n')}
  </ol>
</section>`,
          'guide',
        ),
      );
    }
  }

  if (active.includes('footer')) {
    const note = getVal(state, 'footer', 'note', '');
    parts.push(
      withSectionId(
        `<footer class="em-wrap em-foot">
  <p>${esc(note)}</p>
  <p>Built with Linkmap</p>
</footer>`,
        'footer',
      ),
    );
  }

  return wrapInHtml(buildCss(accent, isDark), parts.join('\n'), 'excel-merge');
}
