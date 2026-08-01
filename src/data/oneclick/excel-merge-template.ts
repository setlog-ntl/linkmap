import type { HomepageTemplateContent } from './homepage-template-content';
import {
  sharedGitignore as gitignore,
  sharedDeployYml as deployYml,
  sharedTsconfigJson as tsconfigJson,
  sharedPostcssConfig as postcssConfig,
  sharedNextConfig as nextConfig,
  makePackageJson,
  makePackageLock,
} from './shared-template-files';

const packageJson = makePackageJson('excel-merge');
const packageLock = makePackageLock('excel-merge');

// ──────────────────────────────────────────────
// src/app/layout.tsx
// ──────────────────────────────────────────────
const layoutTsx = `import type { Metadata } from 'next';
import { siteConfig } from '@/lib/config';
import './globals.css';

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.subtitle,
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.subtitle,
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <head>
        {siteConfig.gaId && (
          <>
            <script async src={\`https://www.googletagmanager.com/gtag/js?id=\${siteConfig.gaId}\`} />
            <script
              dangerouslySetInnerHTML={{
                __html: \`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','\${siteConfig.gaId}');\`,
              }}
            />
          </>
        )}
      </head>
      <body className="antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-slate-900"
        >
          본문 바로가기
        </a>
        {children}
      </body>
    </html>
  );
}
`;

// ──────────────────────────────────────────────
// src/app/page.tsx
// ──────────────────────────────────────────────
const pageTsx = `import { siteConfig } from '@/lib/config';
import '@/app/preset-override.css';
import { HeroSection } from '@/components/hero-section';
import { MergeTool } from '@/components/merge-tool';
import { GuideSection } from '@/components/guide-section';
import { FooterSection } from '@/components/footer-section';

export default function Home() {
  const isDark = siteConfig.bgStyle === 'dark';

  return (
    <main
      id="main"
      className={\`min-h-screen \${isDark ? 'dark bg-[#0b1220] text-slate-100' : 'bg-white text-slate-900'}\`}
    >
      <HeroSection
        badge={siteConfig.badge}
        title={siteConfig.title}
        subtitle={siteConfig.subtitle}
        accent={siteConfig.accent}
      />
      <MergeTool
        headerRow={siteConfig.headerRow}
        autoHeader={siteConfig.autoHeader}
        fileNameColumn={siteConfig.fileNameColumn}
        allSheets={siteConfig.allSheets}
        mergeSimilar={siteConfig.mergeSimilar}
        coerceNumbers={siteConfig.coerceNumbers}
        downloadName={siteConfig.downloadName}
        accent={siteConfig.accent}
      />
      <GuideSection
        heading={siteConfig.guideHeading}
        stepOne={siteConfig.stepOne}
        stepTwo={siteConfig.stepTwo}
        stepThree={siteConfig.stepThree}
        accent={siteConfig.accent}
      />
      <FooterSection note={siteConfig.footerNote} />
    </main>
  );
}
`;

// ──────────────────────────────────────────────
// src/app/globals.css
// ──────────────────────────────────────────────
const globalsCss = `@import 'tailwindcss';

:root {
  --em-accent: #0f766e;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family:
    'Pretendard',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    system-ui,
    sans-serif;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
`;

// ──────────────────────────────────────────────
// src/app/preset-override.css
// ──────────────────────────────────────────────
const presetOverrideCss = `/* ── Excel Merge Theme Override (auto-generated) ── */
:root {
  --em-accent: #0f766e;
}
`;

// ──────────────────────────────────────────────
// src/lib/config.ts
// ──────────────────────────────────────────────
const configTs = `/** 배경 스타일: light | dark */
export type BgStyle = 'light' | 'dark';

export const siteConfig = {
  title: process.env.NEXT_PUBLIC_TITLE || '엑셀 취합기',
  subtitle:
    process.env.NEXT_PUBLIC_SUBTITLE ||
    '매달 부서별로 받는 엑셀 파일, 하나로 합쳐서 바로 내려받으세요.',
  badge: process.env.NEXT_PUBLIC_BADGE || '업로드 없이 브라우저에서',
  guideHeading: process.env.NEXT_PUBLIC_GUIDE_HEADING || '쓰는 방법',
  stepOne:
    process.env.NEXT_PUBLIC_STEP_ONE ||
    '받은 엑셀 파일을 전부 끌어다 놓습니다.',
  stepTwo:
    process.env.NEXT_PUBLIC_STEP_TWO ||
    '행 수와 열이 맞는지 미리보기로 확인합니다.',
  stepThree:
    process.env.NEXT_PUBLIC_STEP_THREE ||
    '엑셀로 내려받아 그대로 보고에 씁니다.',
  footerNote:
    process.env.NEXT_PUBLIC_FOOTER_NOTE ||
    '이 도구는 파일을 서버로 보내지 않습니다. 모든 처리는 이 브라우저 안에서 끝납니다.',
  accent: process.env.NEXT_PUBLIC_ACCENT || '#0f766e',
  bgStyle: (process.env.NEXT_PUBLIC_BG_STYLE || 'light') as BgStyle,
  fileNameColumn: process.env.NEXT_PUBLIC_FILENAME_COLUMN || '출처파일',
  downloadName: process.env.NEXT_PUBLIC_DOWNLOAD_NAME || '취합결과',
  headerRow: 1,
  autoHeader: true,
  allSheets: false,
  mergeSimilar: true,
  coerceNumbers: true,
  gaId: process.env.NEXT_PUBLIC_GA_ID || null,
};

export type SiteConfig = typeof siteConfig;
`;

// ──────────────────────────────────────────────
// src/components/hero-section.tsx
// ──────────────────────────────────────────────
const heroSection = `import { ShieldCheck, Sparkles } from 'lucide-react';

type Props = {
  badge: string;
  title: string;
  subtitle: string;
  accent: string;
};

export function HeroSection({ badge, title, subtitle, accent }: Props) {
  return (
    <header className="w-full max-w-4xl mx-auto px-4 pt-16 pb-4 text-center">
      {badge && (
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
          style={{ background: accent + '1f', color: accent }}
        >
          <Sparkles className="h-3.5 w-3.5" aria-hidden />
          {badge}
        </span>
      )}
      <h1 className="mt-4 text-3xl font-bold leading-snug sm:text-4xl">{title}</h1>
      <p className="mx-auto mt-3 max-w-2xl text-base opacity-75">{subtitle}</p>
      <p className="mt-5 inline-flex items-center gap-2 rounded-lg bg-black/5 px-3 py-1.5 text-xs dark:bg-white/10">
        <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
        업로드 없음 · 설치 없음 · 브라우저 안에서 처리
      </p>
    </header>
  );
}
`;

// ──────────────────────────────────────────────
// src/components/merge-tool.tsx
// ──────────────────────────────────────────────
const mergeTool = `'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import {
  Upload,
  FileSpreadsheet,
  Download,
  Trash2,
  ShieldCheck,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Info,
} from 'lucide-react';

const XLSX_SOURCES = [
  'https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js',
  'https://unpkg.com/xlsx@0.18.5/dist/xlsx.full.min.js',
];

/** 회사 방화벽이 CDN을 막았을 때 보여 줄 문구 — 원인을 짚어 준다 */
const BLOCKED_MSG =
  '엑셀 엔진을 불러오지 못했습니다. 회사 네트워크가 외부 주소를 막고 있을 수 있습니다 — ' +
  '개인 네트워크에서 다시 열어 보거나, 오프라인 버전을 사용하세요.';

type Row = Record<string, unknown>;

type Parsed = {
  id: string;
  name: string;
  sheet: string;
  headerRow: number;
  coerced: number;
  columns: string[];
  rows: Row[];
  error?: string;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    XLSX?: any;
  }
}

let xlsxPromise: Promise<any> | null = null;

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('load failed: ' + src));
    document.head.appendChild(s);
  });
}

/**
 * SheetJS를 한 번만 불러온다. 첫 주소가 막히면 두 번째를 시도한다.
 * 스크립트만 내려받을 뿐, 사용자의 파일은 이 브라우저를 떠나지 않는다.
 */
function loadXlsx(): Promise<any> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('브라우저에서만 동작합니다'));
  }
  if (window.XLSX) return Promise.resolve(window.XLSX);
  if (xlsxPromise) return xlsxPromise;

  xlsxPromise = (async () => {
    for (const src of XLSX_SOURCES) {
      try {
        await loadScript(src);
        if (window.XLSX) return window.XLSX;
      } catch {
        /* 다음 주소로 */
      }
    }
    xlsxPromise = null; // 다시 시도할 수 있게
    throw new Error(BLOCKED_MSG);
  })();
  return xlsxPromise;
}

function readAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result as ArrayBuffer);
    fr.onerror = () => reject(new Error('파일을 읽지 못했습니다'));
    fr.readAsArrayBuffer(file);
  });
}

function toText(v: unknown): string {
  if (v === null || v === undefined) return '';
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  return String(v);
}

/** 열 이름 비교용 정규화 — 공백(전각 포함)과 대소문자를 무시한다 */
function normKey(s: unknown): string {
  return toText(s).replace(/[\\s　]+/g, '').toLowerCase();
}

/**
 * 머리글 행 자동 감지.
 * 파일 위쪽 20행 중 "값이 들어 있는 칸"이 가장 많은 첫 행을 머리글로 본다.
 * 부서마다 파일 맨 위에 제목 줄을 넣는 습관이 달라서, 이게 없으면 취합이 조용히 어긋난다.
 */
function detectHeaderRow(matrix: unknown[][]): number {
  const scan = Math.min(20, matrix.length);
  let best = 0;
  let bestCount = -1;
  for (let i = 0; i < scan; i++) {
    const c = (matrix[i] || []).filter((v) => toText(v).trim() !== '').length;
    if (c > bestCount) {
      bestCount = c;
      best = i;
    }
  }
  return bestCount >= 2 ? best : 0;
}

/** "1,200" · "₩8,500" 처럼 숫자로 보이는 글자를 숫자로 바꾼다 (합계가 되게) */
function coerceNumber(v: unknown): unknown {
  if (typeof v !== 'string') return v;
  const t = v.trim();
  if (t === '') return v;
  if (!/^[₩$€¥\\s]*-?[\\d,\\s]+(\\.\\d+)?\\s*$/.test(t)) return v;
  const n = Number(t.replace(/[₩$€¥,\\s]/g, ''));
  return Number.isFinite(n) ? n : v;
}

type Props = {
  headerRow: number;
  autoHeader: boolean;
  fileNameColumn: string;
  allSheets: boolean;
  mergeSimilar: boolean;
  coerceNumbers: boolean;
  downloadName: string;
  accent: string;
};

export function MergeTool({
  headerRow,
  autoHeader,
  fileNameColumn,
  allSheets,
  mergeSimilar,
  coerceNumbers,
  downloadName,
  accent,
}: Props) {
  const [files, setFiles] = useState<Parsed[]>([]);
  const [skippedSheets, setSkippedSheets] = useState<[string, string[]][]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const useFileNameColumn = Boolean(fileNameColumn);

  const parseOne = useCallback(
    async (XLSX: any, file: File) => {
      const buf = await readAsArrayBuffer(file);
      const wb = XLSX.read(buf, { type: 'array', cellDates: true });
      const names: string[] = allSheets ? wb.SheetNames : [wb.SheetNames[0]];
      const skipped: string[] = allSheets ? [] : wb.SheetNames.slice(1);

      const parts = names.filter(Boolean).map((sheetName) => {
        const ws = wb.Sheets[sheetName];
        // blankrows: true — 감지한 머리글 번호가 엑셀 화면의 행 번호와 같아야 한다
        const matrix: unknown[][] = XLSX.utils.sheet_to_json(ws, {
          header: 1,
          blankrows: true,
          defval: '',
        });
        const hIdx = autoHeader
          ? detectHeaderRow(matrix)
          : Math.max(0, (Number(headerRow) || 1) - 1);
        const body = matrix.slice(hIdx);
        const head = (body[0] || []).map((c, i) => {
          const t = toText(c).trim();
          return t || '열' + (i + 1);
        });

        const rows: Row[] = [];
        let coerced = 0;
        for (let r = 1; r < body.length; r++) {
          const line = body[r] || [];
          if (line.every((c) => toText(c).trim() === '')) continue;
          const row: Row = {};
          head.forEach((key, i) => {
            let v: unknown = line[i] === undefined ? '' : line[i];
            if (coerceNumbers) {
              const nv = coerceNumber(v);
              if (nv !== v) {
                v = nv;
                coerced++;
              }
            }
            row[key] = v;
          });
          if (useFileNameColumn) row[fileNameColumn] = file.name;
          rows.push(row);
        }

        return {
          id: file.name + '::' + sheetName,
          name: file.name,
          sheet: sheetName,
          headerRow: hIdx + 1,
          coerced,
          columns: useFileNameColumn ? [...head, fileNameColumn] : head,
          rows,
        } as Parsed;
      });

      return { parts, skipped };
    },
    [allSheets, autoHeader, headerRow, coerceNumbers, useFileNameColumn, fileNameColumn]
  );

  const addFiles = useCallback(
    async (list: FileList | null) => {
      // ⚠️ FileList는 살아 있는 참조다. onChange가 input.value를 비우면 이 목록도 비워진다.
      //    await 전에 반드시 배열로 복사해 둘 것 — 안 그러면 파일 선택 경로가 0건이 된다.
      const picked = list ? Array.from(list) : [];
      if (picked.length === 0) return;
      setBusy(true);
      setError(null);
      try {
        const XLSX = await loadXlsx();
        const incoming: Parsed[] = [];
        const skips: [string, string[]][] = [];
        for (const file of picked) {
          try {
            const { parts, skipped } = await parseOne(XLSX, file);
            incoming.push(...parts);
            if (skipped.length > 0) skips.push([file.name, skipped]);
          } catch {
            incoming.push({
              id: file.name + '::error',
              name: file.name,
              sheet: '-',
              headerRow: 0,
              coerced: 0,
              columns: [],
              rows: [],
              error: '이 파일은 읽지 못했습니다',
            });
          }
        }
        setFiles((prev) => {
          const seen = new Set(prev.map((p) => p.id));
          return [...prev, ...incoming.filter((p) => !seen.has(p.id))];
        });
        setSkippedSheets((prev) => [...prev, ...skips]);
      } catch (e) {
        setError(e instanceof Error ? e.message : '알 수 없는 오류');
      } finally {
        setBusy(false);
      }
    },
    [parseOne]
  );

  const merged = useMemo(() => {
    const ok = files.filter((f) => !f.error);
    const canon = new Map<string, string>();
    const order: string[] = [];
    const alias: [string, string][] = [];

    for (const f of ok) {
      for (const c of f.columns) {
        const k = mergeSimilar ? normKey(c) : c;
        const cur = canon.get(k);
        if (cur === undefined) {
          canon.set(k, c);
          order.push(k);
        } else if (cur !== c && !alias.some((a) => a[0] === cur && a[1] === c)) {
          alias.push([cur, c]);
        }
      }
    }

    const columns = order.map((k) => canon.get(k) as string);
    const rows: Row[] = [];
    for (const f of ok) {
      for (const r of f.rows) {
        const filled: Row = {};
        for (const k of order) {
          const disp = canon.get(k) as string;
          let v = r[disp];
          if (v === undefined && mergeSimilar) {
            const hit = Object.keys(r).find((kk) => normKey(kk) === k);
            if (hit) v = r[hit];
          }
          filled[disp] = v === undefined ? '' : v;
        }
        rows.push(filled);
      }
    }
    return { columns, rows, alias, fileCount: ok.length };
  }, [files, mergeSimilar]);

  const notices = useMemo(() => {
    const out: string[] = [];
    const shifted = files.filter((f) => !f.error && f.headerRow > 1);
    if (shifted.length > 0) {
      out.push(
        \`머리글이 첫 줄이 아닌 파일을 찾았습니다 — \${shifted
          .map((f) => \`\${f.name} (\${f.headerRow}번째 줄)\`)
          .join(', ')}\`
      );
    }
    if (merged.alias.length > 0) {
      out.push(
        \`이름이 조금 다른 열을 같은 열로 합쳤습니다 — \${merged.alias
          .map((a) => \`“\${a[1]}” → “\${a[0]}”\`)
          .join(', ')}\`
      );
    }
    const coerced = files.reduce((a, f) => a + f.coerced, 0);
    if (coerced > 0) {
      out.push(\`글자로 저장돼 있던 숫자 \${coerced}칸을 숫자로 바꿨습니다 (합계가 되도록)\`);
    }
    if (skippedSheets.length > 0) {
      out.push(
        \`쓰지 않은 시트가 있습니다 — \${skippedSheets
          .map(([f, s]) => \`\${f} (\${s.join(', ')})\`)
          .join(', ')}. 필요하면 “모든 시트 합치기”를 켜세요\`
      );
    }
    const junk = merged.columns.filter((c) => /^열\\d+$/.test(c));
    if (junk.length > 0) {
      out.push(\`이름 없는 열이 있습니다 — \${junk.join(', ')}. 원본의 머리글을 확인해 주세요\`);
    }
    return out;
  }, [files, merged, skippedSheets]);

  const download = useCallback(async () => {
    if (merged.rows.length === 0) return;
    setBusy(true);
    try {
      const XLSX = await loadXlsx();
      const ws = XLSX.utils.json_to_sheet(merged.rows, { header: merged.columns });
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, '취합');
      const base = (downloadName || '취합결과').replace(/\\.xlsx$/i, '');
      XLSX.writeFile(wb, base + '.xlsx');
    } catch (e) {
      setError(e instanceof Error ? e.message : '내려받기에 실패했습니다');
    } finally {
      setBusy(false);
    }
  }, [merged, downloadName]);

  const reset = useCallback(() => {
    setFiles([]);
    setSkippedSheets([]);
    setError(null);
  }, []);

  const preview = merged.rows.slice(0, 15);

  return (
    <section id="tool" className="w-full max-w-4xl mx-auto px-4 py-10">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          void addFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        className={
          'cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition ' +
          (dragging
            ? 'border-[color:var(--em-accent)] bg-[color:var(--em-accent)]/10'
            : 'border-black/15 dark:border-white/20 hover:border-[color:var(--em-accent)]')
        }
      >
        <Upload className="mx-auto mb-3 h-8 w-8 opacity-70" aria-hidden />
        <p className="text-base font-semibold">엑셀 파일을 여기에 끌어다 놓으세요</p>
        <p className="mt-1 text-sm opacity-70">
          .xlsx · .xls · .csv — 여러 개를 한 번에 올릴 수 있습니다
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".xlsx,.xls,.csv"
          className="hidden"
          onChange={(e) => {
            void addFiles(e.target.files);
            e.target.value = '';
          }}
        />
      </div>

      <p className="mt-3 flex items-center justify-center gap-2 text-xs opacity-70">
        <ShieldCheck className="h-4 w-4" aria-hidden />
        파일은 이 브라우저 안에서만 처리됩니다. 어디에도 올라가지 않습니다.
      </p>

      {error && (
        <p className="mt-4 flex items-center gap-2 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" aria-hidden />
          {error}
        </p>
      )}

      {files.length > 0 && (
        <div className="mt-6 space-y-2">
          {files.map((f) => (
            <div
              key={f.id}
              className="flex items-center gap-3 rounded-xl border border-black/10 px-4 py-3 text-sm dark:border-white/15"
            >
              <FileSpreadsheet className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
              <span className="truncate font-medium">{f.name}</span>
              <span className="shrink-0 text-xs opacity-60">{f.sheet}</span>
              <span className="ml-auto shrink-0 text-xs opacity-70">
                {f.error ? f.error : f.rows.length.toLocaleString() + '행'}
              </span>
              <button
                type="button"
                aria-label={f.name + ' 제거'}
                onClick={() => setFiles((prev) => prev.filter((p) => p.id !== f.id))}
                className="shrink-0 rounded p-1 opacity-60 hover:opacity-100"
              >
                <Trash2 className="h-4 w-4" aria-hidden />
              </button>
            </div>
          ))}
        </div>
      )}

      {notices.length > 0 && (
        <div className="mt-5 rounded-xl border border-black/10 bg-black/[0.03] p-4 dark:border-white/15 dark:bg-white/[0.05]">
          <p className="mb-2 flex items-center gap-2 text-sm font-semibold">
            <Info className="h-4 w-4" style={{ color: accent }} aria-hidden />
            확인이 필요한 것
          </p>
          <ul className="list-disc space-y-1 pl-5 text-xs opacity-80">
            {notices.map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
        </div>
      )}

      {merged.rows.length > 0 && (
        <>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <p className="flex items-center gap-2 text-sm font-semibold">
              <CheckCircle2 className="h-4 w-4" style={{ color: accent }} aria-hidden />
              파일 {merged.fileCount}개 · {merged.rows.length.toLocaleString()}행 · 열{' '}
              {merged.columns.length}개
            </p>
            <button
              type="button"
              onClick={() => void download()}
              disabled={busy}
              className="ml-auto inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition disabled:opacity-60"
              style={{ background: accent }}
            >
              {busy ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              ) : (
                <Download className="h-4 w-4" aria-hidden />
              )}
              엑셀로 내려받기
            </button>
            <button
              type="button"
              onClick={reset}
              className="rounded-xl border border-black/15 px-4 py-2.5 text-sm dark:border-white/20"
            >
              전체 비우기
            </button>
          </div>

          <div className="mt-4 overflow-x-auto rounded-xl border border-black/10 dark:border-white/15">
            <table className="w-full text-left text-xs">
              <thead className="bg-black/5 dark:bg-white/10">
                <tr>
                  {merged.columns.map((c) => (
                    <th key={c} className="whitespace-nowrap px-3 py-2 font-semibold">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.map((r, i) => (
                  <tr key={i} className="border-t border-black/5 dark:border-white/10">
                    {merged.columns.map((c) => (
                      <td key={c} className="whitespace-nowrap px-3 py-2">
                        {toText(r[c])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {merged.rows.length > preview.length && (
            <p className="mt-2 text-xs opacity-60">
              미리보기는 처음 {preview.length}행만 보여 줍니다. 내려받으면 전체가 들어갑니다.
            </p>
          )}
        </>
      )}

      {busy && files.length === 0 && (
        <p className="mt-6 flex items-center justify-center gap-2 text-sm opacity-70">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          읽는 중…
        </p>
      )}
    </section>
  );
}
`;

// ──────────────────────────────────────────────
// src/components/guide-section.tsx
// ──────────────────────────────────────────────
const guideSection = `type Props = {
  heading: string;
  stepOne: string;
  stepTwo: string;
  stepThree: string;
  accent: string;
};

export function GuideSection({ heading, stepOne, stepTwo, stepThree, accent }: Props) {
  const steps = [stepOne, stepTwo, stepThree].filter(Boolean);
  if (steps.length === 0) return null;

  return (
    <section className="w-full max-w-4xl mx-auto px-4 pb-14">
      <h2 className="mb-5 text-lg font-bold">{heading}</h2>
      <ol className="grid gap-3 sm:grid-cols-3">
        {steps.map((s, i) => (
          <li
            key={i}
            className="rounded-xl border border-black/10 p-4 text-sm dark:border-white/15"
          >
            <span
              className="mb-2 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ background: accent }}
            >
              {i + 1}
            </span>
            <p className="opacity-80">{s}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
`;

// ──────────────────────────────────────────────
// src/components/footer-section.tsx
// ──────────────────────────────────────────────
const footerSection = `export function FooterSection({ note }: { note: string }) {
  return (
    <footer className="w-full max-w-4xl mx-auto px-4 pb-14 text-center text-xs opacity-55">
      <p>{note}</p>
      <p className="mt-2">
        Built with{' '}
        <a
          href="https://linkmap.biz"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2"
        >
          Linkmap
        </a>
      </p>
    </footer>
  );
}
`;

export const excelMergeTemplate: HomepageTemplateContent = {
  slug: 'excel-merge',
  repoName: 'excel-merge',
  description: '나만의 엑셀자동화 - Linkmap으로 생성',
  files: [
    { path: '.gitignore', content: gitignore },
    { path: '.github/workflows/deploy.yml', content: deployYml },
    { path: 'package.json', content: packageJson },
    { path: 'package-lock.json', content: packageLock },
    { path: 'tsconfig.json', content: tsconfigJson },
    { path: 'postcss.config.mjs', content: postcssConfig },
    { path: 'next.config.ts', content: nextConfig },
    { path: 'src/app/layout.tsx', content: layoutTsx },
    { path: 'src/app/page.tsx', content: pageTsx },
    { path: 'src/app/globals.css', content: globalsCss },
    { path: 'src/app/preset-override.css', content: presetOverrideCss },
    { path: 'src/lib/config.ts', content: configTs },
    { path: 'src/components/hero-section.tsx', content: heroSection },
    { path: 'src/components/merge-tool.tsx', content: mergeTool },
    { path: 'src/components/guide-section.tsx', content: guideSection },
    { path: 'src/components/footer-section.tsx', content: footerSection },
  ],
};
