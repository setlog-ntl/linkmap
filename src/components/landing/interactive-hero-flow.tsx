'use client';

import { useMemo, useState, useCallback } from 'react';
import {
    ReactFlow,
    MarkerType,
    type Node,
    type Edge,
    type EdgeMouseHandler,
    Background,
    BackgroundVariant,
    ConnectionLineType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import FlowLayerNode from './flow-layer-node';
import FlowServiceNode from './flow-service-node';
import HeroGroupNode from './hero-group-node';
import { getServiceEmoji } from '@/lib/constants/service-brands';
import { NODE_OFFSETS, NODE_OFFSETS_MOBILE, GROUP_CONFIGS, LAYOUT } from '@/data/hero-flow-config';
import { useIsMobile } from '@/hooks/use-mobile';

const nodeTypes = {
    layer: FlowLayerNode,
    service: FlowServiceNode,
    group: HeroGroupNode,
};

/* ─────────────────── helpers ─────────────────── */
function svc(
    id: string, label: string, iconSlug: string,
    status: 'connected' | 'in_progress' | 'not_started',
    configured: number, total: number, envKey: string,
    highlighted = false,
): Node {
    return {
        id, type: 'service', position: { x: 0, y: 0 },
        data: { label, emoji: getServiceEmoji(iconSlug), iconSlug, status, envConfigured: configured, envTotal: total, envKey, highlighted },
        draggable: false, selectable: false,
    };
}

const DISCONNECTED_IDS = new Set(['e-naver-myapp', 'e-myapp-gemini', 'e-myapp-vercel', 'e-firebase-myapp']);

/* ─────────────────── Nodes ─────────────────── */
const baseNodes: Node[] = [
    // ── Group regions (위치/크기는 런타임에 계산) ──
    ...Object.entries(GROUP_CONFIGS).map(([id, cfg]) => ({
        id, type: 'group' as const, position: { x: 0, y: 0 },
        data: { label: cfg.label, colorHint: cfg.colorHint },
        style: { width: LAYOUT.groupWidth, height: 0, overflow: 'visible' as const },
        zIndex: -1, draggable: false, selectable: false,
    })),

    // ── Database ──
    svc('supabase', 'Supabase', 'supabase', 'connected',   2, 2, 'SUPABASE_URL'),
    svc('firebase', 'Firebase', 'firebase', 'not_started', 0, 3, 'FIREBASE_CONFIG'),

    // ── Center hub ──
    {
        id: 'myapp', type: 'layer', position: { x: 0, y: 0 },
        data: { label: 'My App', emoji: getServiceEmoji('nextjs'), iconSlug: 'nextjs', layer: 'frontend', highlighted: true },
        draggable: false, selectable: false,
    },

    // ── Auth ──
    svc('google',     'Google', 'google-oauth',  'connected',   1, 1, 'GOOGLE_CLIENT_ID'),
    svc('kakao',      'Kakao',  'kakao-login',   'connected',   2, 2, 'KAKAO_REST_KEY'),
    svc('naver',      'Naver',  'naver-login',   'not_started', 0, 2, 'NAVER_CLIENT_ID'),

    // ── AI ──
    svc('openai',     'OpenAI', 'openai',        'connected',   1, 1, 'OPENAI_API_KEY'),
    svc('gemini',     'Gemini', 'google-gemini', 'not_started', 0, 1, 'GEMINI_API_KEY'),

    // ── Deploy ──
    svc('vercel',     'Vercel',      'vercel',     'not_started', 0, 1, 'VERCEL_TOKEN'),
    svc('cloudflare', 'Cloudflare',  'cloudflare', 'connected',   2, 2, 'CF_API_TOKEN', true),

    // ── CI/CD ──
    svc('github',     'GitHub',      'github',     'connected',   2, 2, 'GITHUB_TOKEN', true),
];

/* ─────────────────── Edge styles ─────────────────── */
const connectedStyle = {
    stroke: 'var(--brand-green)', strokeWidth: 1.5,
    filter: 'drop-shadow(0 0 3px var(--brand-green))',
};
const connectedHoverStyle = {
    stroke: 'var(--brand-green)', strokeWidth: 2.5,
    filter: 'drop-shadow(0 0 8px var(--brand-green))',
};
const blueStyle = {
    stroke: 'var(--brand-blue)', strokeWidth: 1.5,
    filter: 'drop-shadow(0 0 3px var(--brand-blue))',
};
const blueHoverStyle = {
    stroke: 'var(--brand-blue)', strokeWidth: 2.5,
    filter: 'drop-shadow(0 0 8px var(--brand-blue))',
};
const disconnectedStyle = {
    stroke: 'var(--muted-foreground)', strokeWidth: 1,
    strokeDasharray: '5 4', opacity: 0.25,
};
const disconnectedHoverStyle = {
    stroke: 'var(--muted-foreground)', strokeWidth: 2,
    strokeDasharray: '5 4', opacity: 0.5,
};

const connectedMarker = {
    type: MarkerType.ArrowClosed,
    width: 8,
    height: 8,
    color: 'var(--brand-green)',
};
const blueMarker = {
    type: MarkerType.ArrowClosed,
    width: 8,
    height: 8,
    color: 'var(--brand-blue)',
};

function edge(
    id: string, source: string, target: string,
    style: Record<string, unknown>,
    animated = true,
    sourceHandle?: string,
    targetHandle?: string,
    marker?: typeof connectedMarker,
): Edge {
    const e: Edge = { id, source, target, type: 'smoothstep', animated, style };
    if (sourceHandle) e.sourceHandle = sourceHandle;
    if (targetHandle) e.targetHandle = targetHandle;
    if (marker) e.markerEnd = marker;
    return e;
}

/* ─────────────────── Edges ─────────────────── */
const baseEdges: Edge[] = [
    // DB → myapp
    edge('e-supabase-myapp', 'supabase', 'myapp', connectedStyle,    true,  'bottom', 'top',  connectedMarker),
    edge('e-firebase-myapp', 'firebase', 'myapp', disconnectedStyle, false, 'bottom', 'top'),
    // Auth → myapp
    edge('e-google-myapp',   'google',   'myapp', connectedStyle,    true,  'right', 'left',  connectedMarker),
    edge('e-kakao-myapp',    'kakao',    'myapp', connectedStyle,    true,  'right', 'left',  connectedMarker),
    edge('e-naver-myapp',    'naver',    'myapp', disconnectedStyle, false, 'right', 'left'),
    // myapp → AI
    edge('e-myapp-openai',   'myapp', 'openai',    connectedStyle,    true,  'right', 'left',  connectedMarker),
    edge('e-myapp-gemini',   'myapp', 'gemini',    disconnectedStyle, false, 'right', 'left'),
    // myapp → Deploy
    edge('e-myapp-vercel',   'myapp', 'vercel',    disconnectedStyle, false, 'right', 'left'),
    edge('e-myapp-cloudflare','myapp','cloudflare', connectedStyle,   true,  'right', 'left',  connectedMarker),
    // myapp → GitHub CI/CD (myapp 하단 → github 상단, 수직 연결)
    edge('e-myapp-github',   'myapp', 'github',    blueStyle,        true,  'bottom', 'top',  blueMarker),
];

/* ─────────────────── Component ─────────────────── */
export function InteractiveHeroFlow() {
    const [hoveredEdge, setHoveredEdge] = useState<string | null>(null);
    const isMobile = useIsMobile();

    const currentNodes = useMemo(() => {
        const isClient = typeof window !== 'undefined';
        const cx = isClient ? window.innerWidth / 2 : 700;
        const { groupPadding: GP, groupWidth: GW, nodeHeight: NODE_H } = LAYOUT;

        // 모바일에서는 좁은 폭에 맞춘 오프셋 사용 (데스크톱은 기존 유지)
        const offsets = isMobile ? NODE_OFFSETS_MOBILE : NODE_OFFSETS;

        // Convert service/layer node offsets → absolute positions
        const positions: Record<string, { x: number; y: number }> = {};
        for (const [id, offset] of Object.entries(offsets)) {
            positions[id] = { x: cx + offset.dx, y: offset.dy };
        }

        // Compute g-outer bounding box from all members
        const groupPositions: Record<string, { x: number; y: number; h: number; w?: number }> = {};

        for (const [gid, cfg] of Object.entries(GROUP_CONFIGS)) {
            const memberPositions = cfg.members
                .map(mid => positions[mid])
                .filter(Boolean);
            if (memberPositions.length === 0) continue;

            let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
            for (const p of memberPositions) {
                minX = Math.min(minX, p.x);
                minY = Math.min(minY, p.y);
                maxX = Math.max(maxX, p.x + GW);
                maxY = Math.max(maxY, p.y + NODE_H);
            }

            const w = (maxX - minX) + GP * 2;
            groupPositions[gid] = {
                x: minX - GP,
                y: minY - GP,
                h: (maxY - minY) + GP * 2,
                ...(w > GW + GP * 2 ? { w } : {}),
            };
        }

        return baseNodes.map(n => {
            const clone = { ...n, position: { ...n.position }, style: n.style ? { ...n.style } : undefined };

            const gp = groupPositions[n.id];
            if (gp) {
                clone.position = { x: gp.x, y: gp.y };
                if (clone.style) {
                    clone.style.height = gp.h;
                    if (gp.w) clone.style.width = gp.w;
                }
            } else if (positions[n.id]) {
                clone.position = positions[n.id];
            }
            return clone;
        });
    }, [isMobile]);

    const currentEdges = useMemo(() => {
        return baseEdges.map(e => {
            if (hoveredEdge !== e.id) return e;
            const isDisconnected = DISCONNECTED_IDS.has(e.id);
            const isBlue = e.id === 'e-myapp-github';
            return {
                ...e,
                style: isDisconnected ? disconnectedHoverStyle : isBlue ? blueHoverStyle : connectedHoverStyle,
                zIndex: 10,
            };
        });
    }, [hoveredEdge]);

    const onEdgeMouseEnter: EdgeMouseHandler = useCallback((_event, edgeItem) => {
        setHoveredEdge(edgeItem.id);
    }, []);

    const onEdgeMouseLeave: EdgeMouseHandler = useCallback(() => {
        setHoveredEdge(null);
    }, []);

    // 모바일: fitView가 minZoom 0.1까지 축소해 가독성이 깨지므로
    // 고정 줌(0.6)으로 다이어그램을 중앙에 노출한다. (데스크톱은 fitView 유지)
    const mobileViewport = useMemo(() => {
        if (!isMobile) return undefined;
        const vw = typeof window !== 'undefined' ? window.innerWidth : 390;
        const zoom = 0.6;
        // 노드가 cx(=vw/2) 기준으로 배치되므로, cx*zoom 만큼 좌측으로 이동시켜
        // 화면 가로 중앙에 다이어그램 중심이 오도록 한다.
        const cx = vw / 2;
        return { x: cx - cx * zoom, y: 24, zoom };
    }, [isMobile]);

    return (
        <div className="absolute inset-0 z-0 opacity-85 dark:opacity-90">
            <ReactFlow
                key={isMobile ? 'mobile' : 'desktop'}
                nodes={currentNodes}
                edges={currentEdges}
                nodeTypes={nodeTypes}
                connectionLineType={ConnectionLineType.SmoothStep}
                onEdgeMouseEnter={onEdgeMouseEnter}
                onEdgeMouseLeave={onEdgeMouseLeave}
                fitView={!isMobile}
                fitViewOptions={{ padding: 0.18, minZoom: 0.2 }}
                defaultViewport={mobileViewport}
                minZoom={isMobile ? 0.6 : 0.1}
                maxZoom={1.2}
                panOnDrag={false}
                zoomOnScroll={false}
                zoomOnPinch={false}
                zoomOnDoubleClick={false}
                preventScrolling={false}
                nodesDraggable={false}
                nodesConnectable={false}
                elementsSelectable={false}
                proOptions={{ hideAttribution: true }}
            >
                <Background variant={BackgroundVariant.Dots} gap={24} size={1.5} color="var(--dot-color, #334155)" />
            </ReactFlow>
        </div>
    );
}
