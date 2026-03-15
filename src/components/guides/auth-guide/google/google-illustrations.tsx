'use client';

import { ConsoleFrame } from '../console-frame';

// Static red pulse indicator for click annotations
function ClickMarker({ cx, cy, num }: { cx: number; cy: number; num: number }) {
  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r="14"
        fill="#ef4444"
        opacity="0.2"
        style={{
          animation: 'pulse-ring 1.5s ease-out infinite',
        }}
      />
      <circle cx={cx} cy={cy} r="10" fill="#ef4444" />
      <text
        x={cx}
        y={cy + 1}
        textAnchor="middle"
        dominantBaseline="central"
        fill="white"
        fontSize="10"
        fontWeight="bold"
      >
        {num}
      </text>
    </g>
  );
}

// Dashed blue input annotation
function InputField({
  x,
  y,
  w,
  h,
  label,
  value,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  value?: string;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill="#1e293b"
        stroke="#3b82f6"
        strokeWidth="1.5"
        strokeDasharray="5,3"
        rx="3"
      />
      <text x={x + 6} y={y - 4} fill="#3b82f6" fontSize="9" fontWeight="600">
        INPUT: {label}
      </text>
      {value && (
        <text
          x={x + 8}
          y={y + h / 2 + 1}
          fill="#9aa0a6"
          fontSize="9"
          dominantBaseline="central"
        >
          {value}
        </text>
      )}
    </g>
  );
}

// Yellow highlight rectangle
function Highlight({
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
      fill="#f59e0b"
      opacity="0.15"
      rx="3"
      stroke="#f59e0b"
      strokeWidth="1"
      strokeOpacity="0.4"
    />
  );
}

const pulseKeyframes = `
@keyframes pulse-ring {
  0% { r: 10; opacity: 0.3; }
  100% { r: 20; opacity: 0; }
}
`;

// ─── Step 1a: GCP Top Bar with Project Dropdown ───
function Step1a() {
  return (
    <ConsoleFrame url="console.cloud.google.com">
      <svg viewBox="0 0 500 260" className="w-full">
        <style>{pulseKeyframes}</style>
        {/* GCP header bar */}
        <rect width="500" height="40" fill="#1a73e8" />
        <text x="16" y="25" fill="white" fontSize="13" fontWeight="bold">
          Google Cloud
        </text>
        {/* Project dropdown button */}
        <rect x="130" y="10" width="130" height="22" rx="3" fill="#1558b0" />
        <text x="140" y="25" fill="#cfe2ff" fontSize="10">
          My Project ▾
        </text>
        <ClickMarker cx={195} cy={21} num={1} />
        {/* Navigation tabs */}
        <rect x="300" y="12" width="50" height="18" rx="2" fill="transparent" />
        <text x="308" y="24" fill="#a8c7fa" fontSize="9">
          IAM
        </text>
        <rect x="360" y="12" width="50" height="18" rx="2" fill="transparent" />
        <text x="368" y="24" fill="#a8c7fa" fontSize="9">
          API
        </text>
        <rect x="420" y="12" width="60" height="18" rx="2" fill="transparent" />
        <text x="428" y="24" fill="#a8c7fa" fontSize="9">
          결제
        </text>
        {/* Sidebar */}
        <rect x="0" y="40" width="120" height="220" fill="#202124" />
        <rect x="0" y="52" width="120" height="28" fill="#303134" />
        <text x="16" y="70" fill="#e8eaed" fontSize="10">
          대시보드
        </text>
        <text x="16" y="100" fill="#9aa0a6" fontSize="10">
          API 및 서비스
        </text>
        <text x="16" y="122" fill="#9aa0a6" fontSize="10">
          IAM 및 관리자
        </text>
        <text x="16" y="144" fill="#9aa0a6" fontSize="10">
          결제
        </text>
        <text x="16" y="166" fill="#9aa0a6" fontSize="10">
          Compute Engine
        </text>
        <text x="16" y="188" fill="#9aa0a6" fontSize="10">
          Cloud Storage
        </text>
        {/* Main content area */}
        <rect x="120" y="40" width="380" height="220" fill="#292a2d" />
        <text x="150" y="80" fill="#e8eaed" fontSize="14" fontWeight="bold">
          대시보드
        </text>
        {/* Dashboard cards */}
        <rect x="150" y="95" width="155" height="70" rx="4" fill="#303134" />
        <text x="165" y="116" fill="#9aa0a6" fontSize="9">
          프로젝트 정보
        </text>
        <text x="165" y="135" fill="#e8eaed" fontSize="10">
          프로젝트 이름: My Project
        </text>
        <text x="165" y="150" fill="#9aa0a6" fontSize="8">
          프로젝트 번호: 123456789
        </text>
        <rect x="320" y="95" width="155" height="70" rx="4" fill="#303134" />
        <text x="335" y="116" fill="#9aa0a6" fontSize="9">
          API 요청
        </text>
        <rect x="335" y="125" width="120" height="5" rx="2" fill="#1a73e8" opacity="0.5" />
        <rect x="335" y="135" width="80" height="5" rx="2" fill="#1a73e8" opacity="0.3" />
        <rect x="335" y="145" width="100" height="5" rx="2" fill="#1a73e8" opacity="0.4" />
      </svg>
    </ConsoleFrame>
  );
}

// ─── Step 1b: New Project Modal ───
function Step1b() {
  return (
    <ConsoleFrame url="console.cloud.google.com/projectcreate">
      <svg viewBox="0 0 500 260" className="w-full">
        <style>{pulseKeyframes}</style>
        {/* Dimmed background */}
        <rect width="500" height="260" fill="#292a2d" />
        {/* Modal */}
        <rect x="100" y="30" width="300" height="200" rx="8" fill="#303134" />
        <text
          x="250"
          y="60"
          textAnchor="middle"
          fill="#e8eaed"
          fontSize="14"
          fontWeight="bold"
        >
          새 프로젝트
        </text>
        {/* Divider */}
        <line x1="120" y1="72" x2="380" y2="72" stroke="#5f6368" strokeWidth="0.5" />
        {/* Project name label + input */}
        <text x="130" y="100" fill="#9aa0a6" fontSize="10">
          프로젝트 이름 *
        </text>
        <InputField x={130} y={108} w={240} h={28} label="프로젝트 이름" />
        {/* Project ID */}
        <text x="130" y="160" fill="#9aa0a6" fontSize="9">
          프로젝트 ID: my-project-12345
        </text>
        <text x="130" y="175" fill="#5f6368" fontSize="8">
          프로젝트 ID는 전역적으로 고유해야 합니다
        </text>
        {/* Buttons */}
        <rect x="280" y="195" width="90" height="28" rx="4" fill="#1a73e8" />
        <text
          x="325"
          y="213"
          textAnchor="middle"
          fill="white"
          fontSize="11"
          fontWeight="600"
        >
          만들기
        </text>
        <ClickMarker cx={325} cy={209} num={2} />
        <text x="240" y="213" fill="#8ab4f8" fontSize="11" textAnchor="middle">
          취소
        </text>
      </svg>
    </ConsoleFrame>
  );
}

// ─── Step 2a: OAuth Consent Screen Menu ───
function Step2a() {
  return (
    <ConsoleFrame url="console.cloud.google.com/apis/credentials/consent">
      <svg viewBox="0 0 500 280" className="w-full">
        <style>{pulseKeyframes}</style>
        {/* Header */}
        <rect width="500" height="40" fill="#1a73e8" />
        <text x="16" y="25" fill="white" fontSize="13" fontWeight="bold">
          Google Cloud
        </text>
        {/* Sidebar */}
        <rect x="0" y="40" width="140" height="240" fill="#202124" />
        <text x="16" y="66" fill="#9aa0a6" fontSize="10">
          API 및 서비스
        </text>
        <line x1="10" y1="74" x2="130" y2="74" stroke="#5f6368" strokeWidth="0.5" />
        <text x="24" y="92" fill="#9aa0a6" fontSize="10">
          라이브러리
        </text>
        <text x="24" y="112" fill="#9aa0a6" fontSize="10">
          사용자 인증 정보
        </text>
        {/* Highlighted menu item */}
        <Highlight x={4} y={118} w={132} h={24} />
        <rect x="4" y="118" width="3" height="24" fill="#8ab4f8" rx="1" />
        <text x="24" y="134" fill="#8ab4f8" fontSize="10" fontWeight="bold">
          OAuth 동의 화면
        </text>
        <text x="24" y="154" fill="#9aa0a6" fontSize="10">
          도메인 확인
        </text>
        {/* Main content */}
        <rect x="140" y="40" width="360" height="240" fill="#292a2d" />
        <text x="170" y="75" fill="#e8eaed" fontSize="14" fontWeight="bold">
          OAuth 동의 화면
        </text>
        <text x="170" y="100" fill="#9aa0a6" fontSize="10">
          사용자가 앱에 로그인할 때 표시되는 화면을 구성합니다.
        </text>
        {/* User Type radio buttons */}
        <text x="170" y="130" fill="#e8eaed" fontSize="11">
          User Type
        </text>
        {/* Internal option */}
        <circle cx="185" cy="155" r="7" fill="none" stroke="#9aa0a6" strokeWidth="1.5" />
        <text x="200" y="159" fill="#9aa0a6" fontSize="10">
          내부 (Internal)
        </text>
        <text x="200" y="173" fill="#5f6368" fontSize="8">
          조직 내 사용자만 사용 가능
        </text>
        {/* External option - selected */}
        <Highlight x={165} y={185} w={280} h={40} />
        <circle cx="185" cy="200" r="7" fill="none" stroke="#8ab4f8" strokeWidth="1.5" />
        <circle cx="185" cy="200" r="4" fill="#8ab4f8" />
        <text x="200" y="204" fill="#e8eaed" fontSize="10" fontWeight="bold">
          외부 (External)
        </text>
        <text x="200" y="218" fill="#9aa0a6" fontSize="8">
          Google 계정을 보유한 모든 사용자 사용 가능
        </text>
        {/* Create button */}
        <rect x="170" y="240" width="70" height="26" rx="4" fill="#1a73e8" />
        <text x="205" y="257" textAnchor="middle" fill="white" fontSize="10">
          만들기
        </text>
      </svg>
    </ConsoleFrame>
  );
}

// ─── Step 2b: Scopes Table ───
function Step2b() {
  return (
    <ConsoleFrame url="console.cloud.google.com/apis/credentials/consent/edit">
      <svg viewBox="0 0 500 240" className="w-full">
        <style>{pulseKeyframes}</style>
        {/* Background */}
        <rect width="500" height="240" fill="#292a2d" />
        <text x="30" y="30" fill="#e8eaed" fontSize="13" fontWeight="bold">
          범위 (Scopes)
        </text>
        <text x="30" y="48" fill="#9aa0a6" fontSize="9">
          앱에서 요청할 사용자 데이터 범위를 설정합니다.
        </text>
        {/* Table header */}
        <rect x="30" y="60" width="440" height="24" rx="3" fill="#303134" />
        <text x="50" y="76" fill="#9aa0a6" fontSize="9" fontWeight="bold">
          범위
        </text>
        <text x="200" y="76" fill="#9aa0a6" fontSize="9" fontWeight="bold">
          설명
        </text>
        <text x="400" y="76" fill="#9aa0a6" fontSize="9" fontWeight="bold">
          상태
        </text>
        {/* Highlight background for all rows */}
        <Highlight x={30} y={84} w={440} h={110} />
        {/* Row 1: email */}
        <rect x="30" y="84" width="440" height="35" fill="transparent" />
        <text x="50" y="105" fill="#e8eaed" fontSize="10">
          .../auth/userinfo.email
        </text>
        <text x="200" y="105" fill="#9aa0a6" fontSize="9">
          이메일 주소 확인
        </text>
        <rect x="390" y="94" width="55" height="18" rx="9" fill="#1b5e20" />
        <text x="417" y="107" textAnchor="middle" fill="#4caf50" fontSize="8" fontWeight="bold">
          추가됨
        </text>
        <line x1="50" y1="119" x2="450" y2="119" stroke="#5f6368" strokeWidth="0.3" />
        {/* Row 2: profile */}
        <rect x="30" y="119" width="440" height="35" fill="transparent" />
        <text x="50" y="140" fill="#e8eaed" fontSize="10">
          .../auth/userinfo.profile
        </text>
        <text x="200" y="140" fill="#9aa0a6" fontSize="9">
          개인정보 확인
        </text>
        <rect x="390" y="129" width="55" height="18" rx="9" fill="#1b5e20" />
        <text x="417" y="142" textAnchor="middle" fill="#4caf50" fontSize="8" fontWeight="bold">
          추가됨
        </text>
        <line x1="50" y1="154" x2="450" y2="154" stroke="#5f6368" strokeWidth="0.3" />
        {/* Row 3: openid */}
        <rect x="30" y="154" width="440" height="35" fill="transparent" />
        <text x="50" y="175" fill="#e8eaed" fontSize="10">
          openid
        </text>
        <text x="200" y="175" fill="#9aa0a6" fontSize="9">
          OpenID Connect 인증
        </text>
        <rect x="390" y="164" width="55" height="18" rx="9" fill="#1b5e20" />
        <text x="417" y="177" textAnchor="middle" fill="#4caf50" fontSize="8" fontWeight="bold">
          추가됨
        </text>
        {/* Update button */}
        <rect x="380" y="205" width="90" height="26" rx="4" fill="#1a73e8" />
        <text x="425" y="222" textAnchor="middle" fill="white" fontSize="10">
          저장 후 계속
        </text>
      </svg>
    </ConsoleFrame>
  );
}

// ─── Step 3: Create OAuth Client ID ───
function Step3() {
  return (
    <ConsoleFrame url="console.cloud.google.com/apis/credentials/oauthclient">
      <svg viewBox="0 0 500 280" className="w-full">
        <style>{pulseKeyframes}</style>
        {/* Header */}
        <rect width="500" height="40" fill="#1a73e8" />
        <text x="16" y="25" fill="white" fontSize="13" fontWeight="bold">
          Google Cloud
        </text>
        {/* Content area */}
        <rect x="0" y="40" width="500" height="240" fill="#292a2d" />
        {/* Create credentials button */}
        <rect x="30" y="55" width="180" height="30" rx="4" fill="#1a73e8" />
        <text x="40" y="74" fill="white" fontSize="10" fontWeight="600">
          + 사용자 인증 정보 만들기
        </text>
        <ClickMarker cx={195} cy={70} num={1} />
        {/* Form section */}
        <text x="30" y="115" fill="#e8eaed" fontSize="12" fontWeight="bold">
          OAuth 클라이언트 ID 만들기
        </text>
        <text x="30" y="135" fill="#9aa0a6" fontSize="10">
          애플리케이션 유형
        </text>
        <rect x="30" y="142" width="200" height="26" rx="3" fill="#303134" stroke="#5f6368" strokeWidth="0.5" />
        <text x="42" y="159" fill="#e8eaed" fontSize="10">
          웹 애플리케이션 ▾
        </text>
        {/* Redirect URI section */}
        <text x="30" y="195" fill="#e8eaed" fontSize="11" fontWeight="bold">
          승인된 리디렉션 URI
        </text>
        <text x="30" y="210" fill="#9aa0a6" fontSize="8">
          인증 후 사용자가 리디렉션되는 URI
        </text>
        <InputField
          x={30}
          y={218}
          w={420}
          h={28}
          label="리디렉션 URI"
          value="https://abc123.supabase.co/auth/v1/callback"
        />
        {/* Create button */}
        <rect x="380" y="254" width="70" height="24" rx="4" fill="#1a73e8" />
        <text x="415" y="270" textAnchor="middle" fill="white" fontSize="10">
          만들기
        </text>
      </svg>
    </ConsoleFrame>
  );
}

// ─── Step 4: Copy Client ID / Secret ───
function Step4() {
  return (
    <ConsoleFrame url="console.cloud.google.com/apis/credentials">
      <svg viewBox="0 0 500 280" className="w-full">
        <style>{pulseKeyframes}</style>
        {/* Dimmed background */}
        <rect width="500" height="280" fill="#292a2d" opacity="0.7" />
        {/* Modal overlay */}
        <rect x="60" y="30" width="380" height="220" rx="8" fill="#303134" />
        <text
          x="250"
          y="62"
          textAnchor="middle"
          fill="#e8eaed"
          fontSize="13"
          fontWeight="bold"
        >
          OAuth 클라이언트가 생성되었습니다
        </text>
        <line x1="80" y1="74" x2="420" y2="74" stroke="#5f6368" strokeWidth="0.5" />
        {/* Client ID */}
        <text x="90" y="100" fill="#9aa0a6" fontSize="10">
          클라이언트 ID
        </text>
        <Highlight x={90} y={106} w={300} h={28} />
        <rect x="90" y="106" width="300" height="28" rx="3" fill="#202124" />
        <text x="100" y="124" fill="#e8eaed" fontSize="9">
          {'123456789-ab\u2022\u2022\u2022\u2022\u2022\u2022.apps.googleusercontent.com'}
        </text>
        {/* Copy button for Client ID */}
        <rect x="395" y="108" width="30" height="24" rx="3" fill="#303134" stroke="#5f6368" strokeWidth="0.5" />
        <text x="410" y="124" textAnchor="middle" fill="#8ab4f8" fontSize="10">
          📋
        </text>
        <ClickMarker cx={410} cy={120} num={1} />
        {/* Client Secret */}
        <text x="90" y="160" fill="#9aa0a6" fontSize="10">
          클라이언트 보안 비밀번호
        </text>
        <Highlight x={90} y={166} w={300} h={28} />
        <rect x="90" y="166" width="300" height="28" rx="3" fill="#202124" />
        <text x="100" y="184" fill="#e8eaed" fontSize="9">
          {'GOCSPX-\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022'}
        </text>
        {/* Copy button for Secret */}
        <rect x="395" y="168" width="30" height="24" rx="3" fill="#303134" stroke="#5f6368" strokeWidth="0.5" />
        <text x="410" y="184" textAnchor="middle" fill="#8ab4f8" fontSize="10">
          📋
        </text>
        <ClickMarker cx={410} cy={180} num={2} />
        {/* Warning text */}
        <text x="250" y="216" textAnchor="middle" fill="#f59e0b" fontSize="8">
          ⚠ 이 비밀번호는 다시 표시되지 않습니다. 반드시 복사해 두세요.
        </text>
        {/* Close button */}
        <rect x="320" y="226" width="60" height="22" rx="4" fill="#1a73e8" />
        <text x="350" y="241" textAnchor="middle" fill="white" fontSize="9">
          확인
        </text>
      </svg>
    </ConsoleFrame>
  );
}

// ─── Step 5: Supabase Google Provider ───
function Step5() {
  return (
    <ConsoleFrame url="supabase.com/dashboard/project/abc123/auth/providers">
      <svg viewBox="0 0 500 280" className="w-full">
        <style>{pulseKeyframes}</style>
        {/* Supabase dark bg */}
        <rect width="500" height="280" fill="#1c1c1c" />
        {/* Sidebar */}
        <rect x="0" y="0" width="60" height="280" fill="#171717" />
        <rect x="15" y="15" width="30" height="30" rx="6" fill="#3ecf8e" opacity="0.2" />
        <text x="30" y="35" textAnchor="middle" fill="#3ecf8e" fontSize="14" fontWeight="bold">
          S
        </text>
        <rect x="10" y="60" width="40" height="3" rx="1" fill="#333" />
        <rect x="10" y="72" width="40" height="3" rx="1" fill="#333" />
        <rect x="10" y="84" width="40" height="3" rx="1" fill="#333" />
        <rect x="10" y="96" width="40" height="3" rx="1" fill="#3ecf8e" opacity="0.5" />
        {/* Main content */}
        <text x="80" y="30" fill="#ededed" fontSize="13" fontWeight="bold">
          Authentication &gt; Providers
        </text>
        {/* Google provider row */}
        <rect x="80" y="48" width="400" height="36" rx="4" fill="#262626" />
        {/* Google icon placeholder */}
        <rect x="92" y="55" width="22" height="22" rx="4" fill="#4285f4" />
        <text x="103" y="70" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
          G
        </text>
        <text x="124" y="70" fill="#ededed" fontSize="11" fontWeight="600">
          Google
        </text>
        {/* Toggle ON */}
        <rect x="430" y="58" width="36" height="18" rx="9" fill="#3ecf8e" />
        <circle cx="452" cy="67" r="7" fill="white" />
        {/* Settings form */}
        <rect x="80" y="92" width="400" height="178" rx="4" fill="#262626" />
        <text x="100" y="118" fill="#9aa0a6" fontSize="10">
          Client ID (for OAuth)
        </text>
        <InputField
          x={100}
          y={124}
          w={350}
          h={28}
          label="Client ID"
          value={'123456789-ab\u2022\u2022\u2022\u2022\u2022\u2022.apps.googleusercontent.com'}
        />
        <text x="100" y="176" fill="#9aa0a6" fontSize="10">
          Client Secret (for OAuth)
        </text>
        <InputField
          x={100}
          y={182}
          w={350}
          h={28}
          label="Client Secret"
          value={'GOCSPX-\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022'}
        />
        {/* Save button */}
        <rect x="380" y="224" width="70" height="26" rx="4" fill="#3ecf8e" />
        <text x="415" y="241" textAnchor="middle" fill="#1c1c1c" fontSize="10" fontWeight="bold">
          Save
        </text>
      </svg>
    </ConsoleFrame>
  );
}

// ─── Step 6: URL Configuration ───
function Step6() {
  return (
    <ConsoleFrame url="supabase.com/dashboard/project/abc123/auth/url-configuration">
      <svg viewBox="0 0 500 280" className="w-full">
        <style>{pulseKeyframes}</style>
        {/* Supabase dark bg */}
        <rect width="500" height="280" fill="#1c1c1c" />
        {/* Sidebar */}
        <rect x="0" y="0" width="60" height="280" fill="#171717" />
        <rect x="15" y="15" width="30" height="30" rx="6" fill="#3ecf8e" opacity="0.2" />
        <text x="30" y="35" textAnchor="middle" fill="#3ecf8e" fontSize="14" fontWeight="bold">
          S
        </text>
        <rect x="10" y="60" width="40" height="3" rx="1" fill="#333" />
        <rect x="10" y="72" width="40" height="3" rx="1" fill="#333" />
        <rect x="10" y="84" width="40" height="3" rx="1" fill="#3ecf8e" opacity="0.5" />
        {/* Main content */}
        <text x="80" y="30" fill="#ededed" fontSize="13" fontWeight="bold">
          Authentication &gt; URL Configuration
        </text>
        {/* Card */}
        <rect x="80" y="48" width="400" height="220" rx="4" fill="#262626" />
        {/* Site URL */}
        <text x="100" y="78" fill="#ededed" fontSize="11" fontWeight="600">
          Site URL
        </text>
        <text x="100" y="92" fill="#9aa0a6" fontSize="8">
          로그인 후 기본 리디렉션 대상 URL
        </text>
        <InputField
          x={100}
          y={100}
          w={350}
          h={28}
          label="Site URL"
          value="https://www.linkmap.biz"
        />
        {/* Redirect URLs */}
        <text x="100" y="155" fill="#ededed" fontSize="11" fontWeight="600">
          Redirect URLs
        </text>
        <text x="100" y="169" fill="#9aa0a6" fontSize="8">
          허용된 리디렉션 URL 목록 (와일드카드 지원)
        </text>
        <rect x="100" y="178" width="350" height="60" rx="3" fill="#1e293b" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="5,3" />
        <text x="108" y="171" fill="#3b82f6" fontSize="9" fontWeight="600">
          INPUT: Redirect URLs
        </text>
        <text x="112" y="198" fill="#9aa0a6" fontSize="9">
          https://www.linkmap.biz/auth/callback
        </text>
        <text x="112" y="216" fill="#9aa0a6" fontSize="9">
          http://localhost:3000/auth/callback
        </text>
        {/* Save button */}
        <rect x="380" y="244" width="70" height="22" rx="4" fill="#3ecf8e" />
        <text x="415" y="259" textAnchor="middle" fill="#1c1c1c" fontSize="10" fontWeight="bold">
          Save
        </text>
      </svg>
    </ConsoleFrame>
  );
}

// ─── Step 7: Login Flow Diagram ───
function Step7() {
  return (
    <ConsoleFrame url="www.linkmap.biz/auth/login">
      <svg viewBox="0 0 520 220" className="w-full">
        {/* Background */}
        <rect width="520" height="220" fill="#f8fafc" rx="4" />

        {/* ── Box 1: Linkmap Login ── */}
        <rect x="10" y="30" width="140" height="160" rx="6" fill="#1c1c1c" stroke="#333" strokeWidth="1" />
        <text x="80" y="52" textAnchor="middle" fill="#ededed" fontSize="9" fontWeight="bold">
          Linkmap 로그인
        </text>
        <line x1="20" y1="60" x2="140" y2="60" stroke="#333" strokeWidth="0.5" />
        {/* Google button */}
        <rect x="25" y="70" width="120" height="24" rx="4" fill="#4285f4" />
        <text x="85" y="86" textAnchor="middle" fill="white" fontSize="9">
          Google로 로그인
        </text>
        {/* GitHub button */}
        <rect x="25" y="100" width="120" height="24" rx="4" fill="#333" />
        <text x="85" y="116" textAnchor="middle" fill="white" fontSize="9">
          GitHub로 로그인
        </text>
        {/* Kakao button */}
        <rect x="25" y="130" width="120" height="24" rx="4" fill="#fee500" />
        <text x="85" y="146" textAnchor="middle" fill="#3a1d1d" fontSize="9">
          Kakao로 로그인
        </text>
        <text x="80" y="176" textAnchor="middle" fill="#666" fontSize="7">
          소셜 로그인 선택
        </text>

        {/* Arrow 1 */}
        <line x1="155" y1="110" x2="185" y2="110" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrowhead)" />
        <defs>
          <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#3b82f6" />
          </marker>
        </defs>

        {/* ── Box 2: Google Consent ── */}
        <rect x="190" y="30" width="140" height="160" rx="6" fill="white" stroke="#dadce0" strokeWidth="1" />
        <text x="260" y="52" textAnchor="middle" fill="#202124" fontSize="9" fontWeight="bold">
          Google 계정 선택
        </text>
        <line x1="200" y1="60" x2="320" y2="60" stroke="#dadce0" strokeWidth="0.5" />
        {/* Google logo placeholder */}
        <rect x="240" y="68" width="40" height="20" rx="3" fill="#4285f4" />
        <text x="260" y="82" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">
          G
        </text>
        {/* Account option */}
        <rect x="205" y="96" width="110" height="24" rx="4" fill="#f1f3f4" />
        <circle cx="220" cy="108" r="8" fill="#1a73e8" />
        <text x="220" y="112" textAnchor="middle" fill="white" fontSize="7">
          U
        </text>
        <text x="235" y="112" fill="#202124" fontSize="8">
          user@gmail.com
        </text>
        {/* Allow button */}
        <rect x="230" y="140" width="60" height="22" rx="4" fill="#1a73e8" />
        <text x="260" y="155" textAnchor="middle" fill="white" fontSize="9" fontWeight="600">
          허용
        </text>
        <text x="260" y="178" textAnchor="middle" fill="#5f6368" fontSize="7">
          동의 화면
        </text>

        {/* Arrow 2 */}
        <line x1="335" y1="110" x2="365" y2="110" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrowhead)" />

        {/* ── Box 3: Linkmap Dashboard ── */}
        <rect x="370" y="30" width="140" height="160" rx="6" fill="#1c1c1c" stroke="#3ecf8e" strokeWidth="2" />
        <text x="440" y="52" textAnchor="middle" fill="#3ecf8e" fontSize="9" fontWeight="bold">
          Linkmap Dashboard
        </text>
        <line x1="380" y1="60" x2="500" y2="60" stroke="#333" strokeWidth="0.5" />
        {/* Welcome message */}
        <text x="440" y="85" textAnchor="middle" fill="#ededed" fontSize="12" fontWeight="bold">
          환영합니다!
        </text>
        <text x="440" y="105" textAnchor="middle" fill="#9aa0a6" fontSize="8">
          user@gmail.com
        </text>
        {/* Project cards */}
        <rect x="385" y="118" width="110" height="20" rx="3" fill="#262626" />
        <text x="395" y="132" fill="#9aa0a6" fontSize="8">
          내 프로젝트 (2)
        </text>
        <rect x="385" y="144" width="110" height="16" rx="3" fill="#262626" />
        <text x="395" y="155" fill="#9aa0a6" fontSize="7">
          linkmap-production
        </text>
        <rect x="385" y="164" width="110" height="16" rx="3" fill="#262626" />
        <text x="395" y="175" fill="#9aa0a6" fontSize="7">
          linkmap-staging
        </text>

        {/* Flow labels */}
        <text x="170" y="18" textAnchor="middle" fill="#3b82f6" fontSize="8" fontWeight="600">
          1. 소셜 로그인 클릭
        </text>
        <text x="340" y="18" textAnchor="middle" fill="#3b82f6" fontSize="8" fontWeight="600">
          2. 계정 선택 + 허용
        </text>
        <text x="480" y="18" textAnchor="middle" fill="#3ecf8e" fontSize="8" fontWeight="600">
          3. 대시보드 도착
        </text>
      </svg>
    </ConsoleFrame>
  );
}

export const googleIllustrations: Record<number, React.ReactNode> = {
  1: (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Step1a />
      <Step1b />
    </div>
  ),
  2: (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Step2a />
      <Step2b />
    </div>
  ),
  3: <Step3 />,
  4: <Step4 />,
  5: <Step5 />,
  6: <Step6 />,
  7: <Step7 />,
};
