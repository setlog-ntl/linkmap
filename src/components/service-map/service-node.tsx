'use client';

import { memo, useState } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { ServiceIcon } from '@/components/ui/service-icon';
import { NodeTooltip } from '@/components/service-map/node-tooltip';
import type { ServiceCategory } from '@/types';
import { getCategoryStyle } from '@/lib/constants/category-styles';

/** Hex node dimensions */
const HEX_W = 150;
const HEX_H = 120;
const HEX_R = 42;

/** Generate flat-top hexagon SVG points centered at (0,0) with given radius */
function hexPoints(r: number): string {
  return Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 6;
    return `${r * Math.cos(a)},${r * Math.sin(a)}`;
  }).join(' ');
}

const STATUS_CONFIG: Record<string, { hex: string; pulse: boolean; label: string }> = {
  connected:   { hex: '#22c55e', pulse: false, label: '연결됨' },
  in_progress: { hex: '#f59e0b', pulse: true,  label: '진행 중' },
  not_started: { hex: '#94a3b8', pulse: false, label: '시작 전' },
  error:       { hex: '#ef4444', pulse: true,  label: '오류' },
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
  iconSlug?: string;
  highlighted?: boolean;
  focusOpacity?: number;
  domain?: string;
  isMainService?: boolean;
  isFocusTarget?: boolean;
  [key: string]: unknown;
}

function ServiceNode({ data }: NodeProps) {
  const d = data as unknown as ServiceNodeData;
  const [hovered, setHovered] = useState(false);
  const category = d.category as ServiceCategory;
  const { hexColor } = getCategoryStyle(category);
  const status = STATUS_CONFIG[d.status] || STATUS_CONFIG.not_started;

  const isHighlighted = d.highlighted !== false;
  const focusOpacity = d.focusOpacity ?? 1;
  const isFocusTarget = d.isFocusTarget === true;
  const isMain = d.isMainService === true;
  const isFaded = !isHighlighted || focusOpacity < 1;

  const glowIntensity = isFocusTarget ? 16 : hovered ? 14 : 6;
  const glowAlpha = isFocusTarget ? '60' : hovered ? '50' : '25';
  const strokeW = isFocusTarget ? 2.5 : hovered ? 2 : 1.5;

  const nodeContent = (
    <div
      className="hex-service-node animate-node-enter relative"
      style={{
        width: HEX_W,
        height: HEX_H,
        opacity: isHighlighted ? focusOpacity : 0.12,
        filter: isFaded && focusOpacity < 1 ? 'blur(0.5px) grayscale(0.3)' : undefined,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* SVG Hexagon */}
      <svg
        viewBox={`${-HEX_W / 2} ${-HEX_H / 2} ${HEX_W} ${HEX_H}`}
        className="absolute inset-0 w-full h-full overflow-visible"
        style={{
          filter: `drop-shadow(0 0 ${glowIntensity}px ${hexColor}${glowAlpha})`,
          transition: 'filter 0.3s ease',
        }}
      >
        {/* Focus outer ring */}
        {isFocusTarget && (
          <polygon
            points={hexPoints(HEX_R + 6)}
            fill="none"
            stroke={hexColor}
            strokeWidth="1.5"
            opacity="0.4"
            className="animate-hex-pulse"
          />
        )}

        {/* Main hex */}
        <polygon
          points={hexPoints(HEX_R)}
          className="fill-card"
          stroke={hexColor}
          strokeWidth={strokeW}
        />

        {/* Status bar (top of hex) */}
        <line
          x1="-20" y1={-HEX_R + 6}
          x2="20" y2={-HEX_R + 6}
          stroke={status.hex}
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity={status.pulse ? undefined : 0.8}
        >
          {status.pulse && (
            <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2s" repeatCount="indefinite" />
          )}
        </line>

        {/* Status dot (top-right) */}
        <g transform={`translate(${HEX_R - 10}, ${-HEX_R + 14})`}>
          <circle r="6" className="fill-card" stroke="currentColor" strokeWidth="1" opacity="0.15" />
          <circle r="3" fill={status.hex}>
            {status.pulse && (
              <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
            )}
          </circle>
        </g>
      </svg>

      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none px-3">
        {/* Icon */}
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center mb-1"
          style={{ background: `${hexColor}15` }}
        >
          {d.iconSlug ? (
            <ServiceIcon serviceId={d.iconSlug} size={16} />
          ) : (
            <span className="text-xs text-muted-foreground">&#9881;</span>
          )}
        </div>
        {/* Service name */}
        <span className="font-semibold text-[10.5px] truncate max-w-[100px] text-center leading-tight tracking-tight">
          {d.label}
        </span>
        {/* Category */}
        <span className="text-[8px] text-muted-foreground mt-0.5">
          {CATEGORY_LABELS[category] || category}
        </span>
      </div>

      {/* Handles — transparent, positioned at hex edges */}
      <Handle type="target" position={Position.Top} className="!bg-transparent !border-0 !w-3 !h-3" />
      <Handle type="target" position={Position.Left} className="!bg-transparent !border-0 !w-3 !h-3" />
      <Handle type="source" position={Position.Bottom} className="!bg-transparent !border-0 !w-3 !h-3" />
      <Handle type="source" position={Position.Right} className="!bg-transparent !border-0 !w-3 !h-3" />
    </div>
  );

  return (
    <NodeTooltip label={d.label} status={d.status} domain={d.domain} category={d.category} isMainService={isMain}>
      {nodeContent}
    </NodeTooltip>
  );
}

export default memo(ServiceNode);
