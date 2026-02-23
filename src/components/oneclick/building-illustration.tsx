'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { WireframeSVG } from './template-card';

// ---------------------------------------------------------------------------
// BuildingIllustration — 원클릭 배포 대기 중 조립 애니메이션
// 각 템플릿 slug별 SVG 요소가 순차적으로 조립되는 효과
// ---------------------------------------------------------------------------

interface BuildingIllustrationProps {
  slug: string;
}

// 공통 easing
const ease = [0.21, 0.47, 0.32, 0.98] as const;

// 공통 stagger 컨테이너 variants
const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.3 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.4 },
  },
};

// 공통 아이템 variants
const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.4 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.4, ease } },
};

const slideDown = {
  hidden: { opacity: 0, y: -16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

const slideRight = {
  hidden: { opacity: 0, x: -12 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4, ease } },
};

// Sparkle — 조립 완료 시 반짝임 (맨 마지막 stagger)
function Sparkle({ cx, cy }: { cx: number; cy: number }) {
  return (
    <motion.g variants={scaleIn}>
      <motion.circle
        cx={cx}
        cy={cy}
        r="2"
        fill="currentColor"
        opacity={0.5}
        animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.g>
  );
}

// ── 템플릿별 일러스트레이션 ──

function LinkInBioPro() {
  return (
    <motion.svg
      viewBox="0 0 200 120"
      className="w-full h-full"
      fill="currentColor"
      opacity={0.35}
      variants={containerVariants}
      initial="hidden"
      animate="show"
      exit="exit"
    >
      {/* 아바타 drop */}
      <motion.circle cx="100" cy="24" r="14" variants={slideDown} />
      {/* 링크바 3개 slide-down */}
      <motion.rect x="50" y="48" width="100" height="10" rx="5" variants={slideDown} />
      <motion.rect x="50" y="64" width="100" height="10" rx="5" variants={slideDown} />
      <motion.rect x="50" y="80" width="100" height="10" rx="5" variants={slideDown} />
      {/* 소셜 아이콘 pop */}
      <motion.circle cx="80" cy="106" r="5" variants={scaleIn} />
      <motion.circle cx="100" cy="106" r="5" variants={scaleIn} />
      <motion.circle cx="120" cy="106" r="5" variants={scaleIn} />
      {/* Sparkles */}
      <Sparkle cx={170} cy={18} />
      <Sparkle cx={30} cy={90} />
    </motion.svg>
  );
}

function DigitalNamecard() {
  return (
    <motion.svg
      viewBox="0 0 200 120"
      className="w-full h-full"
      fill="currentColor"
      opacity={0.35}
      variants={containerVariants}
      initial="hidden"
      animate="show"
      exit="exit"
    >
      {/* 카드 테두리 draw */}
      <motion.rect
        x="30" y="10" width="140" height="100" rx="8"
        fill="none" stroke="currentColor" strokeWidth="2" opacity={0.3}
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          show: { pathLength: 1, opacity: 0.3, transition: { duration: 0.8, ease: 'easeInOut' } },
        }}
      />
      {/* 컬러바 fill */}
      <motion.rect
        x="30" y="10" width="140" height="20" rx="8"
        variants={{
          hidden: { scaleX: 0, opacity: 0 },
          show: { scaleX: 1, opacity: 1, transition: { duration: 0.6, ease } },
        }}
        style={{ originX: 0 }}
      />
      {/* 아바타 pop */}
      <motion.circle cx="65" cy="52" r="12" variants={scaleIn} />
      {/* 텍스트 slide */}
      <motion.rect x="85" y="42" width="70" height="6" rx="3" variants={slideRight} />
      <motion.rect x="85" y="54" width="50" height="5" rx="2.5" variants={slideRight} />
      <motion.rect x="45" y="76" width="110" height="5" rx="2.5" variants={slideRight} />
      <motion.rect x="45" y="88" width="90" height="5" rx="2.5" variants={slideRight} />
      {/* Sparkle */}
      <Sparkle cx={162} cy={18} />
    </motion.svg>
  );
}

function DevShowcase() {
  return (
    <motion.svg
      viewBox="0 0 200 120"
      className="w-full h-full"
      fill="currentColor"
      opacity={0.35}
      variants={containerVariants}
      initial="hidden"
      animate="show"
      exit="exit"
    >
      {/* 터미널 draw */}
      <motion.rect
        x="20" y="8" width="160" height="44" rx="6"
        fill="none" stroke="currentColor" strokeWidth="1.5" opacity={0.3}
        variants={fadeIn}
      />
      {/* 도트 3개 pop */}
      <motion.circle cx="32" cy="18" r="3" variants={scaleIn} />
      <motion.circle cx="42" cy="18" r="3" variants={scaleIn} />
      <motion.circle cx="52" cy="18" r="3" variants={scaleIn} />
      {/* 코드라인 타이핑 */}
      <motion.rect
        x="30" y="28" width="60" height="4" rx="2"
        variants={{
          hidden: { scaleX: 0, opacity: 0 },
          show: { scaleX: 1, opacity: 1, transition: { duration: 0.5, ease } },
        }}
        style={{ originX: 0 }}
      />
      <motion.rect
        x="30" y="36" width="80" height="4" rx="2"
        variants={{
          hidden: { scaleX: 0, opacity: 0 },
          show: { scaleX: 1, opacity: 1, transition: { duration: 0.5, ease } },
        }}
        style={{ originX: 0 }}
      />
      <motion.rect
        x="30" y="44" width="40" height="4" rx="2"
        variants={{
          hidden: { scaleX: 0, opacity: 0 },
          show: { scaleX: 1, opacity: 1, transition: { duration: 0.5, ease } },
        }}
        style={{ originX: 0 }}
      />
      {/* 카드 2개 slide */}
      <motion.g variants={fadeUp}>
        <rect x="20" y="62" width="75" height="50" rx="6" fill="none" stroke="currentColor" strokeWidth="1.5" opacity={0.3} />
        <rect x="28" y="70" width="50" height="5" rx="2.5" />
        <rect x="28" y="80" width="60" height="4" rx="2" />
      </motion.g>
      <motion.g variants={fadeUp}>
        <rect x="105" y="62" width="75" height="50" rx="6" fill="none" stroke="currentColor" strokeWidth="1.5" opacity={0.3} />
        <rect x="113" y="70" width="50" height="5" rx="2.5" />
        <rect x="113" y="80" width="60" height="4" rx="2" />
      </motion.g>
      {/* Sparkle */}
      <Sparkle cx={175} cy={14} />
    </motion.svg>
  );
}

function SmallBiz() {
  return (
    <motion.svg
      viewBox="0 0 200 120"
      className="w-full h-full"
      fill="currentColor"
      opacity={0.35}
      variants={containerVariants}
      initial="hidden"
      animate="show"
      exit="exit"
    >
      {/* 히어로 배너 curtain-down */}
      <motion.rect
        x="15" y="8" width="170" height="35" rx="6"
        variants={{
          hidden: { scaleY: 0, opacity: 0 },
          show: { scaleY: 1, opacity: 1, transition: { duration: 0.6, ease } },
        }}
        style={{ originY: 0 }}
      />
      {/* 메뉴 3개 pop */}
      <motion.rect x="15" y="50" width="50" height="30" rx="4" variants={scaleIn} />
      <motion.rect x="75" y="50" width="50" height="30" rx="4" variants={scaleIn} />
      <motion.rect x="135" y="50" width="50" height="30" rx="4" variants={scaleIn} />
      {/* 지도핀 bounce-drop */}
      <motion.g
        variants={{
          hidden: { opacity: 0, y: -20 },
          show: {
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.6,
              ease: [0.34, 1.56, 0.64, 1] as const, // bounce
            },
          },
        }}
      >
        <rect x="80" y="88" width="40" height="16" rx="4" fill="none" stroke="currentColor" strokeWidth="1.5" opacity={0.3} />
        <circle cx="100" cy="102" r="4" />
        <path d="M100 98 L100 90" stroke="currentColor" strokeWidth="2" fill="none" />
      </motion.g>
      {/* Sparkle */}
      <Sparkle cx={178} cy={14} />
      <Sparkle cx={22} cy={102} />
    </motion.svg>
  );
}

function PersonalBrand() {
  return (
    <motion.svg
      viewBox="0 0 200 120"
      className="w-full h-full"
      fill="currentColor"
      opacity={0.35}
      variants={containerVariants}
      initial="hidden"
      animate="show"
      exit="exit"
    >
      {/* 히어로 fade */}
      <motion.rect x="10" y="8" width="180" height="45" rx="6" variants={fadeIn} />
      {/* 텍스트 타이핑 */}
      <motion.rect
        x="40" y="24" width="120" height="8" rx="4" opacity={0.6}
        variants={{
          hidden: { scaleX: 0, opacity: 0 },
          show: { scaleX: 1, opacity: 0.6, transition: { duration: 0.6, ease } },
        }}
        style={{ originX: 0.5 }}
      />
      <motion.rect
        x="60" y="38" width="80" height="5" rx="2.5" opacity={0.6}
        variants={{
          hidden: { scaleX: 0, opacity: 0 },
          show: { scaleX: 1, opacity: 0.6, transition: { duration: 0.5, ease } },
        }}
        style={{ originX: 0.5 }}
      />
      {/* 갤러리 3열 stagger-up */}
      <motion.rect x="10" y="62" width="55" height="50" rx="4" variants={fadeUp} />
      <motion.rect x="72" y="62" width="55" height="50" rx="4" variants={fadeUp} />
      <motion.rect x="134" y="62" width="55" height="50" rx="4" variants={fadeUp} />
      {/* Sparkle */}
      <Sparkle cx={185} cy={12} />
    </motion.svg>
  );
}

function FreelancerPage() {
  return (
    <motion.svg
      viewBox="0 0 200 120"
      className="w-full h-full"
      fill="currentColor"
      opacity={0.35}
      variants={containerVariants}
      initial="hidden"
      animate="show"
      exit="exit"
    >
      {/* 프로필 scale-up */}
      <motion.circle cx="100" cy="20" r="12" variants={scaleIn} />
      {/* 이름 slide */}
      <motion.rect x="70" y="38" width="60" height="6" rx="3" variants={slideRight} />
      <motion.rect x="80" y="48" width="40" height="4" rx="2" variants={slideRight} />
      {/* 서비스카드 3개 pop */}
      <motion.g variants={scaleIn}>
        <rect x="15" y="62" width="50" height="24" rx="4" fill="none" stroke="currentColor" strokeWidth="1.5" opacity={0.3} />
      </motion.g>
      <motion.g variants={scaleIn}>
        <rect x="75" y="62" width="50" height="24" rx="4" fill="none" stroke="currentColor" strokeWidth="1.5" opacity={0.3} />
      </motion.g>
      <motion.g variants={scaleIn}>
        <rect x="135" y="62" width="50" height="24" rx="4" fill="none" stroke="currentColor" strokeWidth="1.5" opacity={0.3} />
      </motion.g>
      {/* 후기 slide-up */}
      <motion.g variants={fadeUp}>
        <rect x="25" y="96" width="65" height="16" rx="4" fill="none" stroke="currentColor" strokeWidth="1.5" opacity={0.3} />
      </motion.g>
      <motion.g variants={fadeUp}>
        <rect x="100" y="96" width="65" height="16" rx="4" fill="none" stroke="currentColor" strokeWidth="1.5" opacity={0.3} />
      </motion.g>
      {/* Sparkle */}
      <Sparkle cx={170} cy={16} />
      <Sparkle cx={30} cy={58} />
    </motion.svg>
  );
}

// ── Default 폴백 ──

function DefaultBuilding() {
  return (
    <motion.svg
      viewBox="0 0 200 120"
      className="w-full h-full"
      fill="currentColor"
      opacity={0.35}
      variants={containerVariants}
      initial="hidden"
      animate="show"
      exit="exit"
    >
      <motion.rect x="30" y="15" width="140" height="10" rx="5" variants={fadeIn} />
      <motion.rect x="50" y="35" width="100" height="6" rx="3" variants={slideRight} />
      <motion.rect x="20" y="55" width="75" height="50" rx="6" variants={fadeUp} />
      <motion.rect x="105" y="55" width="75" height="50" rx="6" variants={fadeUp} />
      <Sparkle cx={175} cy={20} />
    </motion.svg>
  );
}

// ── slug → 컴포넌트 매핑 ──

const ILLUSTRATION_MAP: Record<string, React.FC> = {
  'link-in-bio-pro': LinkInBioPro,
  'digital-namecard': DigitalNamecard,
  'dev-showcase': DevShowcase,
  'small-biz': SmallBiz,
  'personal-brand': PersonalBrand,
  'freelancer-page': FreelancerPage,
};

// 조립 완료 후 유지 시간 (ms)
const HOLD_DURATION = 2000;
// 전체 애니메이션 추정 시간 (stagger 기반)
const ANIMATION_DURATION = 4000;

export function BuildingIllustration({ slug }: BuildingIllustrationProps) {
  const prefersReducedMotion = useReducedMotion();
  const [cycle, setCycle] = useState(0);

  const restartCycle = useCallback(() => {
    setCycle((prev) => prev + 1);
  }, []);

  // 조립 완료 → 2초 유지 → 리셋 루프
  useEffect(() => {
    if (prefersReducedMotion) return;

    const timer = setTimeout(() => {
      restartCycle();
    }, ANIMATION_DURATION + HOLD_DURATION);

    return () => clearTimeout(timer);
  }, [cycle, prefersReducedMotion, restartCycle]);

  // Reduced motion → 정적 WireframeSVG 폴백
  if (prefersReducedMotion) {
    return (
      <div className="w-60 h-[180px] flex items-center justify-center mx-auto">
        <div className="w-48 h-32">
          <WireframeSVG slug={slug} />
        </div>
      </div>
    );
  }

  const Illustration = ILLUSTRATION_MAP[slug] ?? DefaultBuilding;

  return (
    <div className="w-60 h-[180px] flex items-center justify-center mx-auto">
      <div className="w-48 h-32">
        <AnimatePresence mode="wait">
          <Illustration key={cycle} />
        </AnimatePresence>
      </div>
    </div>
  );
}
