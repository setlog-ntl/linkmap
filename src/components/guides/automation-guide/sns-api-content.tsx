'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Badge } from '@/components/ui/badge';
import { Share2 } from 'lucide-react';

const snsApis = [
  {
    name: '카카오 API',
    icon: '💬',
    subtitle: 'Kakao Developers',
    desc: '카카오톡 메시지 보내기, 카카오 로그인, 카카오맵, 카카오페이 등 다양한 API를 제공합니다. 한국 서비스라면 필수적인 연동입니다.',
    features: [
      { name: '카카오 로그인', desc: 'OAuth 2.0 기반 소셜 로그인', free: true },
      { name: '나에게 보내기', desc: '카카오톡으로 나에게 메시지 발송', free: true },
      { name: '친구에게 보내기', desc: '카카오톡 친구에게 메시지 발송', free: true },
      { name: '카카오 알림톡', desc: '비즈니스 알림 메시지 (유료)', free: false },
    ],
    tag: '한국 필수',
    tagColor: 'bg-yellow-100 dark:bg-yellow-900/60 text-yellow-700 dark:text-yellow-300',
    color: 'border-yellow-200 dark:border-yellow-800',
  },
  {
    name: '인스타그램 API',
    icon: '📸',
    subtitle: 'Instagram Basic Display / Graph API',
    desc: '인스타그램 프로필 정보, 미디어 조회, 비즈니스 계정은 자동 게시까지 가능합니다. Meta 앱 검수가 필요합니다.',
    features: [
      { name: 'Basic Display API', desc: '프로필, 미디어 조회 (개인 계정)', free: true },
      { name: 'Graph API', desc: '비즈니스 계정 관리, 인사이트', free: true },
      { name: '자동 게시', desc: '비즈니스 계정에 사진/릴스 자동 업로드', free: true },
      { name: '댓글 관리', desc: '댓글 조회, 답글 작성', free: true },
    ],
    tag: 'Meta 검수 필요',
    tagColor: 'bg-pink-100 dark:bg-pink-900/60 text-pink-700 dark:text-pink-300',
    color: 'border-pink-200 dark:border-pink-800',
  },
  {
    name: 'YouTube Data API',
    icon: '🎬',
    subtitle: 'YouTube Data API v3',
    desc: '동영상 검색, 채널 정보, 재생목록 관리, 댓글 조회 등을 자동화할 수 있습니다. 일일 할당량(Quota)에 주의해야 합니다.',
    features: [
      { name: '동영상 검색', desc: '키워드로 동영상 검색 (비용: 100 quota)', free: true },
      { name: '채널 정보', desc: '구독자 수, 조회수 등 통계', free: true },
      { name: '동영상 업로드', desc: 'API로 동영상 자동 업로드 (1600 quota)', free: true },
      { name: '댓글 관리', desc: '댓글 조회 및 답글 작성', free: true },
    ],
    tag: '일일 할당량 주의',
    tagColor: 'bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-300',
    color: 'border-red-200 dark:border-red-800',
  },
];

const oauthSteps = [
  { step: '1', label: '사용자가 "카카오로 로그인" 클릭', emoji: '👆' },
  { step: '2', label: '카카오 로그인 페이지로 이동 (리다이렉트)', emoji: '🔄' },
  { step: '3', label: '사용자가 "동의하고 계속하기" 클릭', emoji: '✅' },
  { step: '4', label: '카카오가 인가 코드(code)를 내 서버로 전달', emoji: '📨' },
  { step: '5', label: '내 서버가 인가 코드로 액세스 토큰 교환', emoji: '🔑' },
  { step: '6', label: '액세스 토큰으로 카카오 API 호출 가능!', emoji: '🎉' },
];

const oauthCode = `// 1. 카카오 로그인 URL 생성
const KAKAO_AUTH_URL = \`https://kauth.kakao.com/oauth/authorize
  ?client_id=\${process.env.KAKAO_CLIENT_ID}
  &redirect_uri=\${process.env.KAKAO_REDIRECT_URI}
  &response_type=code\`;

// 2. 콜백에서 액세스 토큰 교환
export async function POST(req: NextRequest) {
  const { code } = await req.json();

  const tokenRes = await fetch(
    'https://kauth.kakao.com/oauth/token',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.KAKAO_CLIENT_ID!,
        redirect_uri: process.env.KAKAO_REDIRECT_URI!,
        code,
      }),
    }
  );

  const { access_token } = await tokenRes.json();

  // 3. 액세스 토큰으로 API 호출
  const userRes = await fetch('https://kapi.kakao.com/v2/user/me', {
    headers: { Authorization: \`Bearer \${access_token}\` },
  });

  const user = await userRes.json();
  return NextResponse.json({ user });
}`;

export function SnsApiContent() {
  return (
    <div className="py-6 space-y-0">
      {/* 헤더 */}
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Share2 className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">SNS API 연동</h1>
        </div>
        <p className="text-muted-foreground mb-8 max-w-2xl leading-relaxed">
          카카오, 인스타그램, 유튜브 API를 활용하여 서비스를 확장하는 방법.
          OAuth 인증 흐름부터 실전 연동까지 설명합니다.
        </p>
      </ScrollReveal>

      {/* SNS API 개요 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">주요 SNS API</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            각 플랫폼의 주요 기능과 특징을 비교합니다.
          </p>
        </ScrollReveal>

        <div className="space-y-4 max-w-3xl">
          {snsApis.map((api, idx) => (
            <ScrollReveal key={api.name} delay={idx * 0.1}>
              <div className={`rounded-xl border bg-card shadow-sm p-5 ${api.color}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{api.icon}</span>
                    <div>
                      <div className="font-bold text-sm">{api.name}</div>
                      <div className="text-[10px] text-muted-foreground">{api.subtitle}</div>
                    </div>
                  </div>
                  <Badge variant="secondary" className={`text-[10px] shrink-0 ${api.tagColor}`}>
                    {api.tag}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">{api.desc}</p>

                {/* 기능 목록 */}
                <div className="space-y-1.5">
                  {api.features.map((f) => (
                    <div key={f.name} className="flex items-center gap-2 text-xs">
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] shrink-0 ${
                        f.free
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-500'
                      }`}>
                        {f.free ? '✓' : '$'}
                      </span>
                      <span className="font-medium text-foreground">{f.name}</span>
                      <span className="text-muted-foreground">— {f.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* OAuth 인증 흐름 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">OAuth 인증 흐름</h2>
          <p className="text-muted-foreground mb-4 max-w-2xl text-sm leading-relaxed">
            대부분의 SNS API는 <strong className="text-foreground">OAuth 2.0</strong> 인증을 사용합니다.
            사용자가 비밀번호를 직접 넘기지 않고 &quot;이 앱이 내 정보에 접근해도 될까요?&quot; 식으로 권한을 위임하는 안전한 방식입니다.
          </p>
        </ScrollReveal>

        {/* 흐름 도식 */}
        <ScrollReveal delay={0.1}>
          <div className="max-w-2xl rounded-xl border bg-card shadow-sm p-5 mb-6">
            <h3 className="text-sm font-semibold mb-4">카카오 로그인 OAuth 흐름</h3>
            <div className="space-y-2">
              {oauthSteps.map((s) => (
                <div key={s.step} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm shrink-0">
                    {s.emoji}
                  </div>
                  <div className="flex items-center gap-2 flex-1">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center shrink-0">
                      {s.step}
                    </span>
                    <span className="text-xs text-muted-foreground">{s.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* 코드 예시 */}
        <ScrollReveal delay={0.2}>
          <div className="max-w-3xl">
            <div className="rounded-xl border bg-card overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2 border-b bg-muted/50">
                <Badge variant="secondary" className="text-[10px]">
                  카카오 OAuth 예시
                </Badge>
                <span className="text-[10px] text-muted-foreground">Next.js API Route</span>
              </div>
              <pre className="p-4 overflow-x-auto text-xs leading-relaxed">
                <code className="text-muted-foreground">{oauthCode}</code>
              </pre>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <div className="mt-6 p-3 rounded-lg bg-muted/50 border max-w-2xl">
            <p className="text-xs text-muted-foreground">
              🔒 <strong className="text-foreground">보안 주의:</strong>{' '}
              <code className="text-[10px] bg-background/60 px-1 rounded font-mono">client_secret</code>은
              절대 클라이언트(브라우저)에 노출하면 안 됩니다.
              토큰 교환은 반드시 서버 사이드(API Route)에서 처리하세요.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.35}>
          <div className="mt-4 p-3 rounded-lg bg-muted/50 border max-w-2xl">
            <p className="text-xs text-muted-foreground">
              💡 <strong className="text-foreground">초보자 팁:</strong> 카카오 로그인부터 시작하세요.
              한국어 문서가 잘 되어 있고, 테스트 앱 생성이 무료입니다.{' '}
              <a href="https://developers.kakao.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                developers.kakao.com
              </a>에서 앱을 만들 수 있습니다.
            </p>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
