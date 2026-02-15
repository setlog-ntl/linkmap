'use client';

import { useRef, useState, MouseEvent } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Play, Rocket } from 'lucide-react';
import { motion, useScroll, useTransform, useSpring, useMotionTemplate, useMotionValue } from 'framer-motion';
import { GradientBg } from './gradient-bg';

const FlowArchitectureDiagram = dynamic(
  () => import('./flow-architecture-diagram').then((mod) => ({ default: mod.FlowArchitectureDiagram })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <span className="text-sm text-muted-foreground font-medium">Loading Architecture...</span>
        </div>
      </div>
    ),
  }
);

function Spotlight({ className = "" }: { className?: string }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(120, 119, 198, 0.15),
              transparent 80%
            )
          `,
        }}
      />
    </div>
  );
}

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

  return (
    <section ref={containerRef} className="relative min-h-[100vh] flex flex-col items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <GradientBg />
      </div>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="container relative z-10 px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Badge
              variant="outline"
              className="px-4 py-1.5 text-sm rounded-full bg-background/50 backdrop-blur-md border-primary/20 text-primary shadow-[0_0_15px_rgba(59,130,246,0.2)] animate-pulse-ring"
            >
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              v2.0 Now Available
            </Badge>
          </motion.div>

          {/* Headline */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]">
              Visualize Your <br className="hidden sm:block" />
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-blue-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent animate-gradient-x">
                  Infrastructure
                </span>
                <motion.svg
                  className="absolute -bottom-2 w-full h-3 md:h-4 text-violet-500/40"
                  viewBox="0 0 100 10"
                  preserveAspectRatio="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                >
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="none" />
                </motion.svg>
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground/80 max-w-2xl mx-auto leading-relaxed">
              GitHub부터 데이터베이스까지, 복잡한 서비스 연결을 <strong className="text-foreground font-semibold">한눈에 시각화</strong>하세요.
              <br className="hidden md:block" />
              팀 전체가 이해하는 실시간 인프라 지도를 자동으로 생성합니다.
            </p>
          </div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 w-full justify-center pt-4"
          >
            <Button size="lg" className="h-12 px-8 text-base rounded-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all hover:scale-105" asChild>
              <Link href="/signup">
                무료로 시작하기
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-base rounded-full bg-background/50 backdrop-blur-sm border-white/10 hover:bg-white/5 hover:text-white transition-all" asChild>
              <Link href="/demo">
                <Play className="mr-2 h-4 w-4 fill-current" />
                데모 영상 보기
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Hero Diagram Container */}
        <motion.div
          style={{ y, opacity, scale }}
          className="mt-16 md:mt-24 relative w-full max-w-5xl mx-auto"
        >
          <div className="group relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl overflow-hidden ring-1 ring-white/10">
            <Spotlight />

            {/* Window Bar */}
            <div className="absolute top-0 left-0 right-0 h-10 bg-white/5 border-b border-white/5 flex items-center px-4 gap-2 z-20">
              <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
              <div className="ml-4 px-3 py-0.5 rounded-full bg-black/20 text-[10px] text-muted-foreground font-mono">
                setlog-infrastructure-map.v2
              </div>
            </div>

            {/* Content Area */}
            <div className="relative pt-10 h-[400px] md:h-[500px] lg:h-[600px] bg-gradient-to-b from-transparent to-background/20 p-4 md:p-8">
              <div className="w-full h-full rounded-xl overflow-hidden border border-white/5 shadow-inner bg-black/20 relative">
                {/* Grid Lines inside diagram */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                <FlowArchitectureDiagram />
              </div>

              {/* Floating elements decoration */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute -right-4 top-1/3 p-4 rounded-xl bg-background/80backdrop-blur-md border border-white/10 shadow-xl hidden lg:block"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center text-green-500">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Status</div>
                    <div className="text-sm font-semibold text-green-500">All Systems Operational</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Bottom Glow */}
          <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[80%] h-40 bg-violet-600/20 blur-[100px] rounded-full -z-10 pointer-events-none" />
        </motion.div>

        {/* Trusted By / Tech Stack */}
        <div className="mt-20 pt-10 border-t border-white/5 text-center">
          <p className="text-sm text-muted-foreground mb-6">Powered by modern technologies</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Tech Icons (Text placeholders for now to keep it clean) */}
            {['GitHub', 'Vercel', 'Supabase', 'Next.js', 'React'].map((tech) => (
              <span key={tech} className="text-lg font-semibold text-foreground/60 hover:text-foreground cursor-default">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
