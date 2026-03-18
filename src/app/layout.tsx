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
  alternates: { canonical: "./" },
  title: "Linkmap - 서비스 연결을 한눈에, 안전하게 관리하는 플랫폼",
  description:
    "서비스 연결, API 키 관리, 환경변수 설정까지. 복잡한 프로젝트 초기 설정을 체계적으로 관리하세요.",
  keywords: [
    "바이브 코딩",
    "vibe coding",
    "API 관리",
    "환경변수",
    "서비스 연결",
    "프로젝트 설정",
    "원클릭 배포",
    "서비스 맵",
  ],
  openGraph: {
    title: "Linkmap - 서비스 연결을 한눈에, 안전하게 관리하는 플랫폼",
    description:
      "API 키 · 환경변수 · 서비스 연결 시각화 · 원클릭 배포까지. 복잡한 프로젝트 초기 설정을 체계적으로 관리하세요.",
    url: "https://www.linkmap.biz",
    siteName: "Linkmap",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Linkmap - 서비스 연결을 한눈에, 안전하게 관리하는 플랫폼",
    description:
      "API 키 · 환경변수 · 서비스 연결 시각화 · 원클릭 배포까지. 복잡한 프로젝트 초기 설정을 체계적으로 관리하세요.",
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
