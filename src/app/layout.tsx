import type { Metadata } from "next";
import Script from "next/script";
import { Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/components/providers";
import { PageTracker } from "@/components/tracking/page-tracker";
import "./globals.css";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID;

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.linkmap.biz"),
  alternates: {
    canonical: "./",
    types: { 'application/rss+xml': '/feed.xml' },
  },
  title: "Linkmap - 바이브 코딩 플랫폼 | 시각화·원클릭 배포",
  description:
    "Google 계정 하나면 3분 만에 내 홈페이지 배포. 서비스 맵으로 연결 구조를 시각화하고 환경변수를 안전하게 관리하세요.",
  keywords: [
    "바이브 코딩",
    "vibe coding",
    "바이브코딩 플랫폼",
    "원클릭 배포",
    "홈페이지 만들기",
    "서비스 맵",
    "서비스 시각화",
    "API 관리",
    "환경변수 관리",
    "프로젝트 설정",
    "개발자 도구",
    "무료 홈페이지",
  ],
  openGraph: {
    title: "Linkmap - 한 플랫폼에서 서비스를 시각화하세요",
    description:
      "3분 만에 내 홈페이지 배포 + 서비스 맵으로 연결 구조 시각화. Google 계정만 있으면 무료로 시작할 수 있습니다.",
    url: "https://www.linkmap.biz",
    siteName: "Linkmap",
    locale: "ko_KR",
    type: "website",
  },
  verification: {
    other: {
      "naver-site-verification": "eda0a2e0ae94431654bff58eb59c6b20657cd708",
    },
  },
  twitter: {
    card: "summary_large_image",
    title: "Linkmap - 바이브 코딩 플랫폼 | 시각화·원클릭 배포",
    description:
      "3분 만에 내 홈페이지 배포 + 서비스 맵으로 연결 구조 시각화. 초보자부터 개발자까지, 무료로 시작할 수 있습니다.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="gtag-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `}
            </Script>
          </>
        )}
        {CLARITY_ID && (
          <Script id="clarity-init" strategy="afterInteractive">
            {`
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window,document,"clarity","script","${CLARITY_ID}");
            `}
          </Script>
        )}
      </head>
      <body
        className={`${geistMono.variable} antialiased`}
      >
        <Providers>
          <PageTracker />
          {children}
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
