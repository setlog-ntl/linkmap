'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, ExternalLink, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ServiceIcon } from '@/components/landing/service-icon';
import type { ProjectService, Service, ServiceCategory, HealthCheck, ServiceDependency } from '@/types';
import { allCategoryLabels } from '@/lib/constants/service-filters';
import { getCategoryStyle } from '@/lib/constants/category-styles';

const statusConfig: Record<string, { label: string; ping: string; dot: string }> = {
  connected: { label: '연결됨', ping: 'bg-green-400', dot: 'bg-green-500' },
  in_progress: { label: '진행 중', ping: 'bg-yellow-400', dot: 'bg-yellow-500' },
  not_started: { label: '시작 전', ping: '', dot: 'bg-gray-400' },
  error: { label: '오류', ping: 'bg-red-400', dot: 'bg-red-500' },
};

const healthLabels: Record<string, string> = {
  healthy: '정상',
  degraded: '저하',
  unhealthy: '비정상',
  unknown: '알 수 없음',
};

interface ServiceBentoCardProps {
  projectService: ProjectService & { service?: Service };
  healthCheck?: HealthCheck;
  dependencies?: ServiceDependency[];
  serviceNames?: Record<string, string>;
  className?: string;
}

export function ServiceBentoCard({
  projectService,
  healthCheck,
  dependencies = [],
  serviceNames = {},
  className,
}: ServiceBentoCardProps) {
  const [expanded, setExpanded] = useState(false);
  const service = projectService.service;
  const category = (service?.category as ServiceCategory) || 'other';
  const status = statusConfig[projectService.status] || statusConfig.not_started;
  const gradient = getCategoryStyle(category).accentGradient;
  const hasPing = projectService.status === 'connected' || projectService.status === 'error';

  const envVarCount = service?.required_env_vars?.length || 0;
  const tags = service?.tags || [];
  const costEstimate = service?.monthly_cost_estimate;
  const firstCost = costEstimate && typeof costEstimate === 'object'
    ? Object.values(costEstimate)[0] as string
    : undefined;

  return (
    <Card className={`overflow-hidden transition-shadow hover:shadow-md ${className || ''}`}>
      {/* Accent bar */}
      <div className={`h-1 bg-gradient-to-r ${gradient}`} />

      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            {service?.slug ? (
              <ServiceIcon serviceId={service.slug} size={24} />
            ) : (
              <span className="text-lg">⚙️</span>
            )}
            <div className="min-w-0">
              <div className="font-semibold text-sm truncate">{service?.name || 'Unknown'}</div>
              <div className="text-[10px] text-muted-foreground">
                {allCategoryLabels[category] || category}
              </div>
            </div>
          </div>

          {/* Status badge */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="relative flex h-2.5 w-2.5">
              {hasPing && (
                <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${status.ping}`} />
              )}
              <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${status.dot}`} />
            </span>
            <span className="text-xs text-muted-foreground">{status.label}</span>
          </div>
        </div>

        {/* Preview badges */}
        <div className="flex flex-wrap gap-1">
          {tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-[10px] px-1.5 py-0">
              {tag}
            </Badge>
          ))}
          {envVarCount > 0 && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
              env {envVarCount}
            </Badge>
          )}
          {firstCost && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
              {firstCost}
            </Badge>
          )}
        </div>

        {/* Expandable detail */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="pt-2 border-t space-y-2.5">
                {/* Health check */}
                {healthCheck && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">헬스 체크</span>
                    <span className="flex items-center gap-1">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          healthCheck.status === 'healthy' ? 'bg-green-500' :
                          healthCheck.status === 'degraded' ? 'bg-yellow-500' :
                          healthCheck.status === 'unhealthy' ? 'bg-red-500' : 'bg-gray-400'
                        }`}
                      />
                      <span>{healthLabels[healthCheck.status] || healthCheck.status}</span>
                      {healthCheck.response_time_ms != null && (
                        <span className="text-muted-foreground">({healthCheck.response_time_ms}ms)</span>
                      )}
                    </span>
                  </div>
                )}

                {/* Dependencies */}
                {dependencies.length > 0 && (
                  <div className="space-y-1">
                    <div className="text-xs font-medium">의존성</div>
                    {dependencies.map((dep) => (
                      <div key={dep.id} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <CheckCircle2 className="h-3 w-3 text-green-500 shrink-0" />
                        <span>{serviceNames[dep.depends_on_service_id] || dep.depends_on_service_id}</span>
                        <Badge variant="outline" className="text-[9px] px-1 py-0 ml-auto">
                          {dep.dependency_type === 'required' ? '필수' :
                           dep.dependency_type === 'recommended' ? '권장' :
                           dep.dependency_type === 'optional' ? '선택' : '대체'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}

                {/* Description */}
                {service?.description_ko && (
                  <p className="text-xs text-muted-foreground">{service.description_ko}</p>
                )}

                {/* Links */}
                <div className="flex gap-2">
                  {service?.docs_url && (
                    <a
                      href={service.docs_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      <ExternalLink className="h-3 w-3" />
                      공식 문서
                    </a>
                  )}
                  {service?.website_url && (
                    <a
                      href={service.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      <ExternalLink className="h-3 w-3" />
                      웹사이트
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer toggle */}
        <Button
          variant="ghost"
          size="sm"
          className="w-full h-7 text-xs text-muted-foreground"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <>접기 <ChevronUp className="ml-1 h-3 w-3" /></>
          ) : (
            <>상세 보기 <ChevronDown className="ml-1 h-3 w-3" /></>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
