/**
 * GitHub 가이드 스크린샷 캡처 스크립트
 *
 * 실행: npx playwright test scripts/capture-github-guide.ts
 * 또는: npx tsx scripts/capture-github-guide.ts
 *
 * 출력: public/img/guides/github/*.png
 */

import { chromium } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const OUTPUT_DIR = path.resolve(__dirname, '../public/img/guides/github');

interface CaptureTarget {
  filename: string;
  url: string;
  description: string;
  waitForSelector?: string;
  /** 캡처 전 추가 대기 (ms) */
  delay?: number;
  /** 특정 영역만 캡처할 경우 selector */
  clipSelector?: string;
}

const TARGETS: CaptureTarget[] = [
  {
    filename: '01-signup-page.png',
    url: 'https://github.com/signup',
    description: 'GitHub 가입 페이지',
    waitForSelector: 'body',
    delay: 2000,
  },
  {
    filename: '02-git-download-main.png',
    url: 'https://git-scm.com/downloads',
    description: 'Git 다운로드 메인 페이지',
    waitForSelector: 'main, #main, body',
    delay: 1500,
  },
  {
    filename: '02-git-download-win.png',
    url: 'https://git-scm.com/downloads/win',
    description: 'Git Windows 다운로드 페이지',
    waitForSelector: 'main, #main, body',
    delay: 1500,
  },
  {
    filename: '05-cursor-homepage.png',
    url: 'https://cursor.com',
    description: 'Cursor AI 에디터 홈페이지',
    waitForSelector: 'body',
    delay: 3000,
  },
  {
    filename: '05-vscode-homepage.png',
    url: 'https://code.visualstudio.com',
    description: 'VS Code 홈페이지',
    waitForSelector: 'body',
    delay: 2000,
  },
];

async function main() {
  // 출력 디렉토리 생성
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    locale: 'ko-KR',
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  });

  let successCount = 0;
  let failCount = 0;

  for (const target of TARGETS) {
    const outputPath = path.join(OUTPUT_DIR, target.filename);
    console.log(`\n📸 캡처 중: ${target.description}`);
    console.log(`   URL: ${target.url}`);

    try {
      const page = await context.newPage();

      await page.goto(target.url, {
        waitUntil: 'domcontentloaded',
        timeout: 30_000,
      });

      // 선택자 대기
      if (target.waitForSelector) {
        const selectors = target.waitForSelector.split(',').map((s) => s.trim());
        await Promise.race(
          selectors.map((sel) =>
            page.waitForSelector(sel, { timeout: 10_000 }).catch(() => null),
          ),
        );
      }

      // 추가 대기 (애니메이션/로딩)
      if (target.delay) {
        await page.waitForTimeout(target.delay);
      }

      // 캡처
      if (target.clipSelector) {
        const element = await page.$(target.clipSelector);
        if (element) {
          await element.screenshot({ path: outputPath });
        } else {
          await page.screenshot({ path: outputPath, fullPage: false });
        }
      } else {
        await page.screenshot({ path: outputPath, fullPage: false });
      }

      await page.close();
      console.log(`   ✅ 저장: ${target.filename}`);
      successCount++;
    } catch (error) {
      console.error(`   ❌ 실패: ${target.filename}`, error instanceof Error ? error.message : error);
      failCount++;
    }
  }

  await browser.close();

  console.log(`\n${'='.repeat(40)}`);
  console.log(`캡처 완료: ${successCount}/${TARGETS.length} 성공, ${failCount} 실패`);
  console.log(`출력 경로: ${OUTPUT_DIR}`);
}

main().catch(console.error);
