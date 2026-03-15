'use client';

import { ConsoleFrame } from '../console-frame';

function ClickMarker({ x, y, n }: { x: number; y: number; n: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={10} fill="#ef4444" />
      <text
        x={x}
        y={y + 1}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="white"
        fontSize="10"
        fontWeight="bold"
      >
        {n}
      </text>
    </g>
  );
}

function InputField({
  x,
  y,
  w,
  h,
  label,
  value,
  valueColor = '#1e293b',
  mono = false,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label?: string;
  value: string;
  valueColor?: string;
  mono?: boolean;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={4}
        fill="white"
        stroke="#3b82f6"
        strokeWidth={1.5}
        strokeDasharray="4 2"
      />
      {label && (
        <text x={x + 6} y={y - 4} fontSize="8" fill="#3b82f6" fontWeight="600">
          INPUT: {label}
        </text>
      )}
      <text
        x={x + 8}
        y={y + h / 2 + 1}
        dominantBaseline="middle"
        fontSize="10"
        fill={valueColor}
        fontFamily={mono ? 'monospace' : 'inherit'}
      >
        {value}
      </text>
    </g>
  );
}

function HighlightBox({
  x,
  y,
  w,
  h,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
}) {
  return (
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx={3}
      fill="#f59e0b"
      fillOpacity={0.15}
      stroke="#f59e0b"
      strokeWidth={1.5}
    />
  );
}

/* ──────────────────────────────────────────────
   Step 1 — 카카오 앱 생성
   ────────────────────────────────────────────── */
const Step1 = (
  <ConsoleFrame url="developers.kakao.com/console/app">
    <svg viewBox="0 0 500 280" xmlns="http://www.w3.org/2000/svg" className="w-full">
      {/* Kakao header */}
      <rect x={0} y={0} width={500} height={40} fill="#fee500" />
      <text x={20} y={25} fontSize="14" fontWeight="bold" fill="#3a1d1d">
        Kakao Developers
      </text>
      {/* 내 애플리케이션 button */}
      <rect x={370} y={10} width={110} height={22} rx={4} fill="#3a1d1d" />
      <text x={395} y={24} fontSize="10" fill="#fee500" fontWeight="500">
        내 애플리케이션
      </text>
      <ClickMarker x={355} y={21} n={1} />

      {/* Content area */}
      <rect x={0} y={40} width={500} height={240} fill="#f9f9f9" />

      {/* 애플리케이션 추가하기 button */}
      <rect x={30} y={60} width={160} height={30} rx={6} fill="#fee500" />
      <text x={50} y={80} fontSize="11" fontWeight="600" fill="#3a1d1d">
        + 애플리케이션 추가하기
      </text>
      <ClickMarker x={205} y={75} n={2} />

      {/* App card */}
      <rect x={30} y={110} width={440} height={50} rx={8} fill="white" stroke="#e5e7eb" strokeWidth={1} />
      {/* App icon */}
      <rect x={45} y={120} width={30} height={30} rx={6} fill="#fee500" />
      <text x={53} y={140} fontSize="16" fill="#3a1d1d" fontWeight="bold">
        K
      </text>
      <text x={90} y={132} fontSize="12" fontWeight="600" fill="#1e293b">
        My Linkmap App
      </text>
      <text x={90} y={148} fontSize="9" fill="#6b7280">
        앱 ID: 123456
      </text>

      {/* REST API 키 section */}
      <text x={30} y={190} fontSize="11" fontWeight="600" fill="#3a1d1d">
        REST API 키
      </text>
      <HighlightBox x={28} y={196} w={420} h={34} />
      <rect x={32} y={200} width={370} height={26} rx={4} fill="white" stroke="#d1d5db" strokeWidth={1} />
      <text x={42} y={217} fontSize="11" fill="#374151" fontFamily="monospace">
        a1b2c3d4e5••••••••••••
      </text>
      {/* Copy button */}
      <rect x={410} y={200} width={34} height={26} rx={4} fill="#fee500" />
      <text x={418} y={217} fontSize="10" fill="#3a1d1d">
        복사
      </text>
      <ClickMarker x={460} y={213} n={3} />

      {/* Hint */}
      <text x={30} y={258} fontSize="9" fill="#9ca3af">
        이 키를 Supabase OIDC의 Client ID로 사용합니다
      </text>
    </svg>
  </ConsoleFrame>
);

/* ──────────────────────────────────────────────
   Step 2 — 로그인 활성화 + OIDC
   ────────────────────────────────────────────── */
const Step2 = (
  <ConsoleFrame url="developers.kakao.com/console/app/123456/config/kakaoLogin">
    <svg viewBox="0 0 500 280" xmlns="http://www.w3.org/2000/svg" className="w-full">
      {/* Left sidebar */}
      <rect x={0} y={0} width={130} height={280} fill="white" stroke="#e5e7eb" strokeWidth={1} />
      <text x={15} y={30} fontSize="10" fill="#6b7280">
        일반
      </text>
      <text x={15} y={55} fontSize="10" fill="#6b7280">
        앱 키
      </text>
      {/* Highlighted menu */}
      <rect x={0} y={64} width={130} height={26} fill="#fee500" fillOpacity={0.3} />
      <text x={15} y={81} fontSize="10" fontWeight="600" fill="#3a1d1d">
        카카오 로그인
      </text>
      <ClickMarker x={120} y={77} n={1} />
      <text x={15} y={105} fontSize="10" fill="#6b7280">
        동의항목
      </text>
      <text x={15} y={125} fontSize="10" fill="#6b7280">
        보안
      </text>

      {/* Main content */}
      <rect x={130} y={0} width={370} height={280} fill="#f9f9f9" />
      <text x={150} y={30} fontSize="13" fontWeight="bold" fill="#1e293b">
        카카오 로그인
      </text>

      {/* 활성화 설정 toggle */}
      <text x={150} y={65} fontSize="11" fill="#374151">
        활성화 설정
      </text>
      {/* Toggle ON */}
      <rect x={380} y={53} width={40} height={20} rx={10} fill="#22c55e" />
      <circle cx={410} cy={63} r={8} fill="white" />
      <text x={424} y={67} fontSize="9" fill="#22c55e" fontWeight="600">
        ON
      </text>
      <ClickMarker x={460} y={63} n={2} />

      {/* Divider */}
      <line x1={150} y1={85} x2={480} y2={85} stroke="#e5e7eb" strokeWidth={1} />

      {/* OpenID Connect toggle */}
      <HighlightBox x={145} y={92} w={340} h={40} />
      <text x={150} y={115} fontSize="11" fill="#374151">
        OpenID Connect
      </text>
      <rect x={380} y={102} width={40} height={20} rx={10} fill="#22c55e" />
      <circle cx={410} cy={112} r={8} fill="white" />
      <text x={424} y={116} fontSize="9" fill="#22c55e" fontWeight="600">
        ON
      </text>
      <ClickMarker x={460} y={112} n={3} />

      {/* Warning box */}
      <rect x={150} y={150} width={325} height={45} rx={6} fill="#fef3c7" stroke="#f59e0b" strokeWidth={1} />
      <text x={170} y={167} fontSize="9" fill="#92400e" fontWeight="600">
        ⚠ 주의
      </text>
      <text x={170} y={182} fontSize="9" fill="#92400e">
        OIDC 활성화하지 않으면 Supabase에서 id_token을 받지 못합니다
      </text>
    </svg>
  </ConsoleFrame>
);

/* ──────────────────────────────────────────────
   Step 3 — Redirect URI
   ────────────────────────────────────────────── */
const Step3 = (
  <ConsoleFrame url="developers.kakao.com/console/app/123456/config/kakaoLogin">
    <svg viewBox="0 0 500 220" xmlns="http://www.w3.org/2000/svg" className="w-full">
      <rect x={0} y={0} width={500} height={220} fill="#f9f9f9" />

      <text x={30} y={35} fontSize="14" fontWeight="bold" fill="#1e293b">
        Redirect URI
      </text>
      <text x={30} y={55} fontSize="9" fill="#6b7280">
        카카오 로그인 후 사용자가 돌아올 URL을 등록합니다
      </text>

      {/* Input field */}
      <InputField
        x={30}
        y={75}
        w={380}
        h={32}
        label="Redirect URI"
        value="https://your-ref.supabase.co/auth/v1/callback"
        mono
      />

      {/* 저장 button */}
      <rect x={420} y={75} width={55} height={32} rx={6} fill="#fee500" />
      <text x={434} y={95} fontSize="11" fontWeight="600" fill="#3a1d1d">
        저장
      </text>
      <ClickMarker x={480} y={91} n={1} />

      {/* Hint */}
      <rect x={30} y={130} width={440} height={40} rx={6} fill="white" stroke="#e5e7eb" strokeWidth={1} />
      <text x={45} y={148} fontSize="9" fill="#6b7280">
        Supabase 대시보드 → Authentication → URL Configuration에서 확인 가능
      </text>
      <text x={45} y={162} fontSize="9" fill="#6b7280" fontFamily="monospace">
        https://&lt;project-ref&gt;.supabase.co/auth/v1/callback
      </text>
    </svg>
  </ConsoleFrame>
);

/* ──────────────────────────────────────────────
   Step 4 — 동의 항목
   ────────────────────────────────────────────── */
const Step4 = (
  <ConsoleFrame url="developers.kakao.com/console/app/123456/config/appKey/consent">
    <svg viewBox="0 0 500 240" xmlns="http://www.w3.org/2000/svg" className="w-full">
      <rect x={0} y={0} width={500} height={240} fill="#f9f9f9" />

      <text x={30} y={30} fontSize="14" fontWeight="bold" fill="#1e293b">
        동의 항목 설정
      </text>

      {/* Table header */}
      <rect x={30} y={48} width={440} height={28} rx={0} fill="#f1f5f9" stroke="#e2e8f0" strokeWidth={1} />
      <text x={50} y={66} fontSize="10" fontWeight="600" fill="#475569">
        항목
      </text>
      <text x={200} y={66} fontSize="10" fontWeight="600" fill="#475569">
        동의 수준
      </text>
      <text x={340} y={66} fontSize="10" fontWeight="600" fill="#475569">
        필요 조건
      </text>

      {/* Row 1: 닉네임 */}
      <rect x={30} y={76} width={440} height={36} fill="white" stroke="#e2e8f0" strokeWidth={1} />
      <text x={50} y={99} fontSize="10" fill="#1e293b">
        닉네임
      </text>
      <text x={200} y={99} fontSize="10" fill="#16a34a" fontWeight="600">
        필수 동의
      </text>
      <text x={340} y={99} fontSize="10" fill="#6b7280">
        —
      </text>

      {/* Row 2: 이메일 — highlighted */}
      <HighlightBox x={28} y={110} w={444} h={40} />
      <rect x={30} y={112} width={440} height={36} fill="white" stroke="#e2e8f0" strokeWidth={1} />
      <text x={50} y={135} fontSize="10" fill="#1e293b">
        이메일
      </text>
      <text x={200} y={135} fontSize="10" fill="#d97706" fontWeight="600">
        필수 동의
      </text>
      <text x={340} y={135} fontSize="10" fill="#dc2626" fontWeight="600">
        비즈 앱 필요
      </text>

      {/* Row 3: 프로필 사진 */}
      <rect x={30} y={148} width={440} height={36} fill="white" stroke="#e2e8f0" strokeWidth={1} />
      <text x={50} y={171} fontSize="10" fill="#1e293b">
        프로필 사진
      </text>
      <text x={200} y={171} fontSize="10" fill="#6b7280">
        선택 동의
      </text>
      <text x={340} y={171} fontSize="10" fill="#6b7280">
        —
      </text>

      {/* Note */}
      <rect x={30} y={200} width={440} height={28} rx={4} fill="#fef3c7" stroke="#f59e0b" strokeWidth={1} />
      <text x={50} y={218} fontSize="9" fill="#92400e">
        이메일 필수 동의를 위해서는 앱 설정 → 비즈니스에서 비즈 앱 전환이 필요합니다
      </text>
    </svg>
  </ConsoleFrame>
);

/* ──────────────────────────────────────────────
   Step 5 — Client Secret
   ────────────────────────────────────────────── */
const Step5 = (
  <ConsoleFrame url="developers.kakao.com/console/app/123456/config/kakaoLogin/security">
    <svg viewBox="0 0 500 220" xmlns="http://www.w3.org/2000/svg" className="w-full">
      <rect x={0} y={0} width={500} height={220} fill="#f9f9f9" />

      <text x={30} y={30} fontSize="14" fontWeight="bold" fill="#1e293b">
        보안
      </text>
      <text x={30} y={50} fontSize="9" fill="#6b7280">
        Client Secret 코드를 생성하고 활성화합니다
      </text>

      {/* Client Secret field */}
      <text x={30} y={80} fontSize="10" fontWeight="600" fill="#374151">
        Client Secret
      </text>
      <HighlightBox x={28} y={86} w={400} h={36} />
      <rect x={32} y={90} width={350} height={28} rx={4} fill="white" stroke="#d1d5db" strokeWidth={1} />
      <text x={42} y={108} fontSize="11" fill="#374151" fontFamily="monospace">
        xYz123456••••••••••••
      </text>

      {/* 코드 생성 button */}
      <rect x={30} y={140} width={90} height={30} rx={6} fill="#fee500" />
      <text x={48} y={159} fontSize="11" fontWeight="600" fill="#3a1d1d">
        코드 생성
      </text>
      <ClickMarker x={135} y={155} n={1} />

      {/* 활성화 상태 */}
      <text x={160} y={159} fontSize="10" fill="#374151">
        활성화 상태:
      </text>
      <rect x={240} y={145} width={56} height={22} rx={11} fill="#dcfce7" />
      <text x={251} y={160} fontSize="10" fill="#16a34a" fontWeight="600">
        사용함
      </text>
    </svg>
  </ConsoleFrame>
);

/* ──────────────────────────────────────────────
   Step 6 — Supabase OIDC
   ────────────────────────────────────────────── */
const Step6 = (
  <ConsoleFrame url="supabase.com/dashboard/project/your-ref/auth/providers">
    <svg viewBox="0 0 500 280" xmlns="http://www.w3.org/2000/svg" className="w-full">
      {/* Dark background */}
      <rect x={0} y={0} width={500} height={280} fill="#1c1c1c" />

      {/* Sidebar */}
      <rect x={0} y={0} width={50} height={280} fill="#171717" />
      {/* S logo */}
      <rect x={12} y={12} width={26} height={26} rx={6} fill="#3ecf8e" />
      <text x={19} y={30} fontSize="14" fontWeight="bold" fill="#171717">
        S
      </text>
      {/* Sidebar dots */}
      <circle cx={25} cy={60} r={3} fill="#444" />
      <circle cx={25} cy={80} r={3} fill="#444" />
      <circle cx={25} cy={100} r={3} fill="#3ecf8e" />
      <circle cx={25} cy={120} r={3} fill="#444" />

      {/* Main content */}
      <text x={70} y={35} fontSize="14" fontWeight="bold" fill="#f8fafc">
        Custom OIDC Provider
      </text>
      <text x={70} y={52} fontSize="9" fill="#64748b">
        카카오 로그인을 위한 OIDC Provider 정보를 입력합니다
      </text>

      {/* Name field */}
      <text x={70} y={78} fontSize="9" fill="#94a3b8" fontWeight="500">
        Name
      </text>
      <InputField x={70} y={82} w={380} h={26} value="kakao" mono />

      {/* Client ID field */}
      <text x={70} y={126} fontSize="9" fill="#94a3b8" fontWeight="500">
        Client ID (REST API Key)
      </text>
      <InputField x={70} y={130} w={380} h={26} value="a1b2c3d4e5••••••••••••" mono />

      {/* Client Secret field */}
      <text x={70} y={174} fontSize="9" fill="#94a3b8" fontWeight="500">
        Client Secret
      </text>
      <InputField x={70} y={178} w={380} h={26} value="xYz123456••••••••••••" mono />

      {/* Issuer URL field */}
      <text x={70} y={222} fontSize="9" fill="#94a3b8" fontWeight="500">
        Issuer URL
      </text>
      <InputField
        x={70}
        y={226}
        w={380}
        h={26}
        value="https://kauth.kakao.com"
        valueColor="#3ecf8e"
        mono
      />
    </svg>
  </ConsoleFrame>
);

export const kakaoIllustrations: Record<number, React.ReactNode> = {
  1: Step1,
  2: Step2,
  3: Step3,
  4: Step4,
  5: Step5,
  6: Step6,
};
