'use client';

import { memo, useState } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { ServiceIcon } from '@/components/ui/service-icon';
import { NodeTooltip } from '@/components/service-map/node-tooltip';
import type { ServiceCategory } from '@/types';
import { getServiceBrand } from '@/lib/constants/service-brands';

/** Compact rounded-rect node dimensions */
const NODE_W = 160;
const NODE_H = 72;
const BORDER_RADIUS = 14;

/** Status → color mapping (border glow + status dot) */
const STATUS_CONFIG: Record<string, { hex: string; bright: string; label: string }> = {
  connected:   { hex: '#22c55e', bright: '#86efac', label: '연결됨' },
  in_progress: { hex: '#f59e0b', bright: '#fde68a', label: '진행 중' },
  not_started: { hex: '#64748b', bright: '#94a3b8', label: '시작 전' },
  error:       { hex: '#f97316', bright: '#fdba74', label: '오류' },
};

const CATEGORY_LABELS: Partial<Record<ServiceCategory, string>> = {
  auth: '인증', social_login: '소셜 로그인', database: '데이터베이스',
  deploy: '배포', email: '이메일', payment: '결제', storage: '스토리지',
  monitoring: '모니터링', ai: 'AI/ML', cdn: 'CDN', cicd: 'CI/CD',
  testing: '테스트', sms: 'SMS', push: '푸시', chat: '채팅',
  search: '검색', cms: 'CMS', analytics: '분석', media: '미디어',
  queue: '큐', cache: '캐시', logging: '로깅', feature_flags: '피처 플래그',
  scheduling: '스케줄링', ecommerce: '이커머스', serverless: '서버리스',
  code_quality: '코드 품질', automation: '자동화', domain: '도메인',
  advertising: '광고', other: '기타',
};

interface ServiceNodeData {
  label: string;
  category: ServiceCategory;
  status: string;
  slug?: string;
  highlighted?: boolean;
  focusOpacity?: number;
  domain?: string;
  isMainService?: boolean;
  isFocusTarget?: boolean;
  brandColor?: string;
  enterDelay?: number;
  [key: string]: unknown;
}

function ServiceNode({ data }: NodeProps) {
  const d = data as unknown as ServiceNodeData;
  const [hovered, setHovered] = useState(false);
  const category = d.category as ServiceCategory;
  const status = STATUS_CONFIG[d.status] || STATUS_CONFIG.not_started;

  // Brand color from service-brands registry, fallback to status color
  const brand = d.slug ? getServiceBrand(d.slug) : undefined;
  const brandColor = d.brandColor || brand?.darkColor || status.hex;

  const isHighlighted = d.highlighted !== false;
  const focusOpacity = d.focusOpacity ?? 1;
  const isFocusTarget = d.isFocusTarget === true;
  const isMain = d.isMainService === true;
  const isFaded = !isHighlighted || focusOpacity < 1;

  const glowIntensity = isFocusTarget ? 18 : hovered ? 12 : 4;
  const glowAlpha = isFocusTarget ? '55' : hovered ? '40' : '18';
  const strokeColor = isFocusTarget ? status.bright : hovered ? status.hex : `${status.hex}80`;
  const strokeW = isFocusTarget ? 2 : hovered ? 1.8 : 1.5;
  const enterDelay = (d.enterDelay as number) ?? 0;

  const nodeContent = (
    <div
      className="relative"
      style={{
        width: NODE_W,
        height: NODE_H,
        opacity: isHighlighted ? focusOpacity : 0.12,
        filter: isFaded && focusOpacity < 1 ? 'blur(1px) grayscale(0.4)' : undefined,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        animation: `node-mesh-enter 0.4s ease-out ${enterDelay}ms both`,
        contain: 'layout style paint',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* SVG border with status-based stroke */}
      <svg
        viewBox={`0 0 ${NODE_W} ${NODE_H}`}
        className="absolute inset-0 w-full h-full overflow-visible"
        style={{
          filter: `drop-shadow(0 0 ${glowIntensity}px ${status.hex}${glowAlpha})`,
          transition: 'filter 0.3s ease',
        }}
      >
        {/* Focus pulse ring */}
        {isFocusTarget && (
          <rect
            x="-4" y="-4"
            width={NODE_W + 8} height={NODE_H + 8}
            rx={BORDER_RADIUS + 4}
            fill="none"
            stroke={status.bright}
            strokeWidth="1"
            opacity="0.4"
            className="animate-mesh-pulse"
          />
        )}

        {/* Main rounded rect with status-colored border */}
        <rect
          x="0.75" y="0.75"
          width={NODE_W - 1.5} height={NODE_H - 1.5}
          rx={BORDER_RADIUS}
          className="fill-card"
          stroke={strokeColor}
          strokeWidth={strokeW}
        />

        {/* Left accent bar (brand color) */}
        <rect
          x="0" y={16}
          width="3" height={NODE_H - 32}
          rx="1.5"
          fill={brandColor}
          opacity="0.85"
        />

        {/* In-progress: animated dashed border overlay */}
        {d.status === 'in_progress' && (
          <rect
            x="0.75" y="0.75"
            width={NODE_W - 1.5} height={NODE_H - 1.5}
            rx={BORDER_RADIUS}
            fill="none"
            stroke={status.hex}
            strokeWidth="1"
            strokeDasharray="6 4"
            opacity="0.35"
          >
            <animate
              attributeName="stroke-dashoffset"
              values="0;-20"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </rect>
        )}

        {/* Error: subtle pulsing border overlay */}
        {d.status === 'error' && (
          <rect
            x="0.75" y="0.75"
            width={NODE_W - 1.5} height={NODE_H - 1.5}
            rx={BORDER_RADIUS}
            fill="none"
            stroke={status.hex}
            strokeWidth="1.2"
            opacity="0.3"
            className="animate-mesh-pulse"
          />
        )}
      </svg>

      {/* Status dot — top right */}
      <div
        className="absolute top-2.5 right-2.5 w-[6px] h-[6px] rounded-full"
        style={{ backgroundColor: status.hex, opacity: d.status === 'not_started' ? 0.4 : 1 }}
      />

      {/* Subtle status indicator ring for in_progress / error */}
      {(d.status === 'in_progress' || d.status === 'error') && (
        <div
          className="absolute top-2.5 right-2.5 w-[6px] h-[6px] rounded-full animate-ping"
          style={{
            backgroundColor: status.hex,
            opacity: 0.3,
          }}
        />
      )}

      {/* Content — horizontal layout: icon left, text right */}
      <div className="absolute inset-0 flex items-center gap-2.5 z-10 pointer-events-none px-4">
        {/* Service brand icon */}
        <div
          className="w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center"
          style={{ background: `${brandColor}18` }}
        >
          {d.slug ? (
            <ServiceIcon serviceId={d.slug} size={20} />
          ) : (
            <span className="text-sm text-muted-foreground">&#9881;</span>
          )}
        </div>
        {/* Name + Category */}
        <div className="min-w-0 flex flex-col">
          <span className="font-semibold text-[12px] truncate max-w-[90px] leading-tight tracking-tight">
            {d.label}
          </span>
          <span className="text-[10px] text-muted-foreground mt-0.5 truncate max-w-[90px]">
            {CATEGORY_LABELS[category] || category}
          </span>
        </div>
      </div>

      {/* Handles — transparent, all 4 directions for both source and target */}
      <Handle type="target" position={Position.Top} id="top" className="!bg-transparent !border-0 !w-3 !h-3" />
      <Handle type="target" position={Position.Bottom} id="bottom" className="!bg-transparent !border-0 !w-3 !h-3" />
      <Handle type="target" position={Position.Left} id="left" className="!bg-transparent !border-0 !w-3 !h-3" />
      <Handle type="target" position={Position.Right} id="right" className="!bg-transparent !border-0 !w-3 !h-3" />
      <Handle type="source" position={Position.Top} id="source-top" className="!bg-transparent !border-0 !w-3 !h-3" />
      <Handle type="source" position={Position.Bottom} id="source-bottom" className="!bg-transparent !border-0 !w-3 !h-3" />
      <Handle type="source" position={Position.Left} id="source-left" className="!bg-transparent !border-0 !w-3 !h-3" />
      <Handle type="source" position={Position.Right} id="source-right" className="!bg-transparent !border-0 !w-3 !h-3" />
    </div>
  );

  return (
    <NodeTooltip label={d.label} status={d.status} domain={d.domain} category={d.category} isMainService={isMain}>
      {nodeContent}
    </NodeTooltip>
  );
}

export default memo(ServiceNode);
