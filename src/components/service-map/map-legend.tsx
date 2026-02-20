'use client';

import { Crown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const STATUS_ITEMS = [
  { color: 'bg-green-500', label: '연결됨' },
  { color: 'bg-yellow-500', label: '진행 중' },
  { color: 'bg-gray-400', label: '시작 전' },
  { color: 'bg-red-500', label: '오류' },
];

const CONNECTION_ITEMS = [
  { color: '#3b82f6', dash: false, label: '사용' },
  { color: '#22c55e', dash: false, label: '연동' },
  { color: '#f97316', dash: true, label: '데이터 전달' },
  { color: '#8b5cf6', dash: false, label: 'API 호출' },
  { color: '#ec4899', dash: true, label: '인증 제공' },
  { color: '#14b8a6', dash: true, label: '웹훅' },
  { color: '#6366f1', dash: false, label: 'SDK' },
];

interface MapLegendProps {
  onClose: () => void;
}

export function MapLegend({ onClose }: MapLegendProps) {
  return (
    <div className="absolute bottom-4 right-4 z-20 w-[220px] rounded-lg border bg-background/95 backdrop-blur-sm shadow-lg">
      <div className="flex items-center justify-between px-3 pt-2.5 pb-1.5">
        <span className="text-sm font-medium">범례</span>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Status */}
      <div className="px-3 pb-2">
        <span className="text-[10px] font-medium uppercase text-muted-foreground">상태</span>
        <div className="mt-1 grid grid-cols-2 gap-1">
          {STATUS_ITEMS.map((item) => (
            <div key={item.label} className="flex items-center gap-1.5 text-xs">
              <span className={`w-2 h-2 rounded-full ${item.color}`} />
              {item.label}
            </div>
          ))}
        </div>
      </div>

      {/* Main service */}
      <div className="px-3 pb-2">
        <div className="flex items-center gap-1.5 text-xs">
          <div className="bg-amber-400 text-amber-900 rounded-full p-0.5">
            <Crown className="h-2.5 w-2.5" />
          </div>
          메인 서비스
        </div>
      </div>

      {/* Connection types */}
      <div className="px-3 pb-3">
        <span className="text-[10px] font-medium uppercase text-muted-foreground">연결 타입</span>
        <div className="mt-1 space-y-1">
          {CONNECTION_ITEMS.map((item) => (
            <div key={item.label} className="flex items-center gap-1.5 text-xs">
              <svg width="16" height="6" className="shrink-0">
                <line
                  x1="0" y1="3" x2="16" y2="3"
                  stroke={item.color}
                  strokeWidth="2"
                  strokeDasharray={item.dash ? '4 2' : undefined}
                />
              </svg>
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
