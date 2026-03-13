'use client';

import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';

const HUB_W = 200;
const HUB_H = 170;
const HUB_R = 52;
const CORNER_R = 8;

/**
 * Generate a rounded hexagon SVG path.
 * Each vertex is replaced by a quadratic bezier curve for smooth corners.
 */
function roundedHexPath(R: number, cr: number): string {
  const vertices = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 6;
    return { x: R * Math.cos(a), y: R * Math.sin(a) };
  });

  const parts: string[] = [];
  for (let i = 0; i < 6; i++) {
    const curr = vertices[i];
    const prev = vertices[(i + 5) % 6];
    const next = vertices[(i + 1) % 6];

    const dx1 = prev.x - curr.x;
    const dy1 = prev.y - curr.y;
    const len1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
    const dx2 = next.x - curr.x;
    const dy2 = next.y - curr.y;
    const len2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

    // Points offset inward from vertex by corner radius
    const sx = curr.x + (dx1 / len1) * cr;
    const sy = curr.y + (dy1 / len1) * cr;
    const ex = curr.x + (dx2 / len2) * cr;
    const ey = curr.y + (dy2 / len2) * cr;

    if (i === 0) {
      parts.push(`M ${sx.toFixed(1)} ${sy.toFixed(1)}`);
    } else {
      parts.push(`L ${sx.toFixed(1)} ${sy.toFixed(1)}`);
    }
    parts.push(`Q ${curr.x.toFixed(1)} ${curr.y.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`);
  }
  parts.push('Z');
  return parts.join(' ');
}

/**
 * 8 handles positioned precisely on the hexagon boundary.
 * Each handle corresponds to one of 8 compass directions (45deg sectors).
 *
 * For a hex with R=52, flat sides on left/right:
 * - Cardinal: top (0,-55), right (48,0), bottom (0,55), left (-48,0)
 * - Diagonal: top-right (35,-35), bottom-right (35,35), bottom-left (-35,35), top-left (-35,-35)
 *
 * Percentages are relative to node bounding box (200 x 170), center at (100, 85).
 */
const HUB_HANDLES = [
  { id: 'h-top',    pos: Position.Top,    left: '50%',   top: '17.6%' },
  { id: 'h-tr',     pos: Position.Top,    left: '67.5%', top: '29.4%' },
  { id: 'h-right',  pos: Position.Right,  left: '74%',   top: '50%' },
  { id: 'h-br',     pos: Position.Bottom, left: '67.5%', top: '70.6%' },
  { id: 'h-bottom', pos: Position.Bottom, left: '50%',   top: '82.4%' },
  { id: 'h-bl',     pos: Position.Bottom, left: '32.5%', top: '70.6%' },
  { id: 'h-left',   pos: Position.Left,   left: '26%',   top: '50%' },
  { id: 'h-tl',     pos: Position.Top,    left: '32.5%', top: '29.4%' },
] as const;

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

  const ringR = 68;
  const ringCirc = 2 * Math.PI * ringR;
  const ringFill = healthPct * ringCirc;

  const hexPath = roundedHexPath(HUB_R, CORNER_R);

  return (
    <div
      className="hex-hub-node animate-node-enter relative"
      style={{ width: HUB_W, height: HUB_H }}
    >
      {/* 8 handles on hexagon boundary */}
      {HUB_HANDLES.map((h) => (
        <Handle
          key={h.id}
          type="source"
          position={h.pos}
          id={h.id}
          className="!bg-transparent !border-0 !w-2 !h-2"
          style={{ left: h.left, top: h.top }}
        />
      ))}

      {/* SVG Hub */}
      <svg
        viewBox={`${-HUB_W / 2} ${-HUB_H / 2} ${HUB_W} ${HUB_H}`}
        className="absolute inset-0 w-full h-full overflow-visible"
        style={{ filter: 'url(#gm-glow-lg)' }}
      >
        {/* Health ring background */}
        <circle
          r={ringR}
          fill="none"
          className="stroke-border"
          strokeWidth="2.5"
          opacity="0.15"
        />
        {/* Health ring foreground */}
        <circle
          r={ringR}
          fill="none"
          stroke="#4ade80"
          strokeWidth="2.5"
          strokeDasharray={`${ringFill} ${ringCirc - ringFill}`}
          strokeLinecap="round"
          transform="rotate(-90)"
          opacity="0.5"
          className="animate-hub-glow"
        />
        {/* Rounded hexagon */}
        <path
          d={hexPath}
          className="fill-card"
          stroke="#00d4ff"
          strokeWidth="2"
          strokeLinejoin="round"
          opacity="0.65"
        />
        {/* Subtle connection dots at handle positions */}
        {HUB_HANDLES.map((h) => {
          // Convert percentage to SVG coordinate
          const x = (parseFloat(h.left) / 100) * HUB_W - HUB_W / 2;
          const y = (parseFloat(h.top) / 100) * HUB_H - HUB_H / 2;
          return (
            <circle
              key={h.id}
              cx={x}
              cy={y}
              r="1.5"
              fill="#00d4ff"
              opacity="0.3"
            />
          );
        })}
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
