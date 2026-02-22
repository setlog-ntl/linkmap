'use client';

import { useState } from 'react';
import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Copy, Check, ExternalLink } from 'lucide-react';

interface Platform {
  name: string;
  uiSteps: string;
  cliCommand: string;
  docsUrl: string;
}

const platforms: Platform[] = [
  {
    name: 'Vercel',
    uiSteps: 'Dashboard → Settings → Environment Variables → Key/Value 입력 후 Save',
    cliCommand: 'vercel env add VARIABLE_NAME',
    docsUrl: 'https://vercel.com/docs/environment-variables',
  },
  {
    name: 'Cloudflare Workers',
    uiSteps: 'Dashboard → Workers & Pages → 프로젝트 선택 → Settings → Variables and Secrets',
    cliCommand: 'npx wrangler secret put VARIABLE_NAME',
    docsUrl: 'https://developers.cloudflare.com/workers/configuration/secrets/',
  },
  {
    name: 'Railway',
    uiSteps: 'Dashboard → 프로젝트 선택 → Variables 탭 → Add Variable',
    cliCommand: 'railway variables set VARIABLE_NAME=value',
    docsUrl: 'https://docs.railway.com/guides/variables',
  },
  {
    name: 'Netlify',
    uiSteps: 'Dashboard → Site settings → Environment variables → Add a variable',
    cliCommand: 'netlify env:set VARIABLE_NAME value',
    docsUrl: 'https://docs.netlify.com/environment-variables/overview/',
  },
];

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-md border bg-muted/50 mt-2">
      <div className="flex items-center justify-between px-3 py-1.5">
        <code className="text-xs font-mono">{code}</code>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-1.5 text-xs"
          onClick={handleCopy}
        >
          {copied ? (
            <Check className="h-3 w-3 text-green-500" />
          ) : (
            <Copy className="h-3 w-3 text-muted-foreground" />
          )}
        </Button>
      </div>
    </div>
  );
}

export function DeployPlatformSection() {
  return (
    <section id="deploy-platform" className="scroll-mt-24 py-12 md:py-16">
      <ScrollReveal>
        <h2 className="text-2xl md:text-3xl font-bold mb-3">배포 플랫폼별 설정</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl">
          사용하는 배포 플랫폼에 맞게 환경변수를 등록하세요. UI와 CLI 두 가지 방법을 안내합니다.
        </p>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <div className="max-w-2xl">
          <Accordion type="single" collapsible className="space-y-2">
            {platforms.map((platform, i) => (
              <AccordionItem
                key={platform.name}
                value={`platform-${i}`}
                className="rounded-lg border px-4"
              >
                <AccordionTrigger className="text-left font-medium hover:no-underline">
                  {platform.name}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    {/* UI 방법 */}
                    <div>
                      <h4 className="text-xs font-medium text-muted-foreground mb-1">
                        대시보드 UI
                      </h4>
                      <p className="text-sm">{platform.uiSteps}</p>
                    </div>

                    {/* CLI 방법 */}
                    <div>
                      <h4 className="text-xs font-medium text-muted-foreground mb-1">
                        CLI 명령어
                      </h4>
                      <CodeBlock code={platform.cliCommand} />
                    </div>

                    {/* 문서 링크 */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs gap-1 p-0"
                      asChild
                    >
                      <a href={platform.docsUrl} target="_blank" rel="noopener noreferrer">
                        공식 문서 보기
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </ScrollReveal>
    </section>
  );
}
