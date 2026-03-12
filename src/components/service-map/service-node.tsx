'use client';

import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { ServiceIcon } from '@/components/ui/service-icon';
import { NodeTooltip } from '@/components/service-map/node-tooltip';
import type { ServiceCategory } from '@/types';
import { getCategoryStyle } from '@/lib/constants/category-styles';

const statusDots: Record<string, { color: string; pulse: boolean; label: string }> = {
  connected:   { color: 'bg-green-500',  pulse: false, label: '연결됨' },
  in_progress: { color: 'bg-yellow-500', pulse: true,  label: '진행 중' },
  not_started: { color: 'bg-gray-400 dark:bg-gray-500', pulse: false, label: '시작 전' },
  error:       { color: 'bg-red-500',    pulse: true,  label: '오류' },
};

/** Category display names */
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
  [key: string]: unknown;
}

function ServiceNode({ data }: NodeProps) {
  const d = data as unknown as ServiceNodeData;
  const category = d.category as ServiceCategory;
  const { hexColor } = getCategoryStyle(category);
  const dotStyle = statusDots[d.status] || statusDots.not_started;

  const isHighlighted = d.highlighted !== false;
  const focusOpacity = d.focusOpacity ?? 1;
  const isMain = d.isMainService === true;
  const isFaded = !isHighlighted || focusOpacity < 1;

  const nodeContent = (
    <div
      className={`
        service-node-card animate-node-enter
        relative rounded-xl border bg-card shadow-sm
        transition-all duration-250 ease-[cubic-bezier(0.4,0,0.2,1)]
        hover:shadow-lg hover:scale-[1.03] hover:-translate-y-0.5
        w-[180px] h-[72px]
      `}
      style={{
        borderLeftWidth: 4,
        borderLeftColor: hexColor,
        opacity: isHighlighted ? focusOpacity : 0.35,
        filter: isFaded && focusOpacity < 1 ? 'blur(0.3px)' : undefined,
        transform: isFaded && focusOpacity < 1 ? 'scale(0.97)' : undefined,
        '--node-glow': `${hexColor}40`,
      } as React.CSSProperties}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-blue-400/60 hover:!bg-blue-500 !w-2.5 !h-2.5 !border-0 !transition-all hover:!w-3 hover:!h-3"
      />
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-blue-400/60 hover:!bg-blue-500 !w-2.5 !h-2.5 !border-0 !transition-all hover:!w-3 hover:!h-3"
      />

      {/* Status dot — top-right absolute */}
      <div className="absolute top-2 right-2">
        <span
          className={`block w-2 h-2 rounded-full ${dotStyle.color} ${dotStyle.pulse ? 'animate-status-pulse' : ''}`}
          title={dotStyle.label}
        />
      </div>

      {/* Row 1: Icon container + Service name */}
      <div className="flex items-center gap-2.5 px-3 pt-2.5">
        <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-muted flex items-center justify-center">
          {d.iconSlug ? (
            <ServiceIcon serviceId={d.iconSlug} size={18} />
          ) : (
            <span className="text-xs text-muted-foreground">&#9881;</span>
          )}
        </div>
        <span className="font-medium text-sm truncate flex-1 min-w-0 pr-4">{d.label}</span>
      </div>

      {/* Row 2: Category label */}
      <div className="px-3 mt-0.5">
        <span className="text-[10px] text-muted-foreground leading-tight">
          {CATEGORY_LABELS[category] || category}
        </span>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-blue-400/60 hover:!bg-blue-500 !w-2.5 !h-2.5 !border-0 !transition-all hover:!w-3 hover:!h-3"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-blue-400/60 hover:!bg-blue-500 !w-2.5 !h-2.5 !border-0 !transition-all hover:!w-3 hover:!h-3"
      />
    </div>
  );

  return (
    <NodeTooltip label={d.label} status={d.status} domain={d.domain} category={d.category} isMainService={isMain}>
      {nodeContent}
    </NodeTooltip>
  );
}

export default memo(ServiceNode);
