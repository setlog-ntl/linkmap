'use client';

import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';

const HUB_W = 200;
const HUB_H = 170;
const HUB_R = 52;

function hexPoints(r: number): string {
  return Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 6;
    return `${r * Math.cos(a)},${r * Math.sin(a)}`;
  }).join(' ');
}

interface ProjectNodeData {
  label: string;
  iconUrl: string | null;
  connectedCount?: number;
  totalCount?: number;
  [key: string]: unknown;
}

function ProjectNodeComponent({ data }: NodeProps) {
  const d = data as ProjectNodeData;
  const { label, iconUrl } = d;
  const connectedCount = (d.connectedCount as number) ?? 0;
  const totalCount = (d.totalCount as number) ?? 0;
  const healthPct = totalCount > 0 ? connectedCount / totalCount : 0;

  const ringR = 70;
  const ringCirc = 2 * Math.PI * ringR;
  const ringFill = healthPct * ringCirc;

  // Health ring color based on percentage
  const ringColor = healthPct >= 0.7 ? '#22c55e' : healthPct >= 0.3 ? '#f59e0b' : '#ef4444';

  return (
    <div
      className="hex-hub-node animate-node-enter relative"
      style={{ width: HUB_W, height: HUB_H }}
    >
      {/* Handles */}
      <Handle type="source" position={Position.Top} id="top" className="!bg-transparent !border-0 !w-3 !h-3" />
      <Handle type="source" position={Position.Right} id="right" className="!bg-transparent !border-0 !w-3 !h-3" />
      <Handle type="source" position={Position.Bottom} id="bottom" className="!bg-transparent !border-0 !w-3 !h-3" />
      <Handle type="source" position={Position.Left} id="left" className="!bg-transparent !border-0 !w-3 !h-3" />

      {/* SVG Hub */}
      <svg
        viewBox={`${-HUB_W / 2} ${-HUB_H / 2} ${HUB_W} ${HUB_H}`}
        className="absolute inset-0 w-full h-full overflow-visible"
        style={{
          filter: 'drop-shadow(0 0 20px oklch(0.70 0.12 255 / 0.25)) drop-shadow(0 0 40px oklch(0.70 0.12 255 / 0.10))',
        }}
      >
        {/* Health ring background */}
        <circle
          r={ringR}
          fill="none"
          className="stroke-border"
          strokeWidth="4"
          opacity="0.15"
        />
        {/* Health ring foreground */}
        <circle
          r={ringR}
          fill="none"
          stroke={ringColor}
          strokeWidth="4"
          strokeDasharray={`${ringFill} ${ringCirc - ringFill}`}
          strokeLinecap="round"
          transform="rotate(-90)"
          opacity="0.7"
          className="animate-hub-glow"
        />
        {/* Hub hexagon */}
        <polygon
          points={hexPoints(HUB_R)}
          className="fill-card stroke-primary"
          strokeWidth="2"
        />
      </svg>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        {iconUrl ? (
          <img src={iconUrl} alt="" className="w-10 h-10 rounded-xl object-contain mb-1.5" />
        ) : (
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-bold text-base mb-1.5">
            {label?.charAt(0)?.toUpperCase() ?? 'P'}
          </div>
        )}
        <span className="text-[13px] font-bold tracking-tight truncate max-w-[140px]">{label}</span>
        <span className="text-[11px] text-muted-foreground mt-0.5">
          {totalCount > 0 ? `${connectedCount}/${totalCount} connected` : 'Hub'}
        </span>
      </div>
    </div>
  );
}

export default memo(ProjectNodeComponent);
