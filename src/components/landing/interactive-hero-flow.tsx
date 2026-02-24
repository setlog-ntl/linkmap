'use client';

import { useMemo, useState, useCallback } from 'react';
import {
    ReactFlow,
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

const nodeTypes = {
    layer: FlowLayerNode,
    service: FlowServiceNode,
    group: HeroGroupNode,
};

/* ─────────────────── helpers ─────────────────── */
function svc(id: string, label: string, iconSlug: string, status: 'connected' | 'in_progress' | 'not_started', configured: number, total: number, highlighted = false): Node {
    return {
        id, type: 'service', position: { x: 0, y: 0 },
        data: { label, emoji: getServiceEmoji(iconSlug), iconSlug, status, envConfigured: configured, envTotal: total, highlighted },
        draggable: false, selectable: false,
    };
}

const DISCONNECTED_IDS = new Set(['e-naver-myapp', 'e-myapp-gemini', 'e-myapp-vercel', 'e-myapp-firebase']);

/* ─────────────────── Nodes (10 + 3 group labels) ─────────────────── */
const baseNodes: Node[] = [
    // Group labels
    { id: 'g-auth', type: 'group', position: { x: 0, y: 0 }, data: { label: '🔐 로그인' }, draggable: false, selectable: false },
    { id: 'g-ai', type: 'group', position: { x: 0, y: 0 }, data: { label: '🤖 AI' }, draggable: false, selectable: false },
    { id: 'g-deploy', type: 'group', position: { x: 0, y: 0 }, data: { label: '🚀 배포' }, draggable: false, selectable: false },

    // Center: My App
    {
        id: 'myapp', type: 'layer', position: { x: 0, y: 0 },
        data: { label: 'My App', emoji: getServiceEmoji('nextjs'), iconSlug: 'nextjs', layer: 'frontend', highlighted: true },
        draggable: false, selectable: false,
    },

    // Left: Auth providers
    svc('google', 'Google', 'google-oauth', 'connected', 1, 1),
    svc('kakao', 'Kakao', 'kakao-login', 'connected', 2, 2),
    svc('naver', 'Naver', 'naver-login', 'not_started', 0, 2),

    // Right-top: AI
    svc('openai', 'OpenAI', 'openai', 'connected', 1, 1),
    svc('gemini', 'Gemini', 'google-gemini', 'not_started', 0, 1),

    // Right-bottom: Deploy
    svc('vercel', 'Vercel', 'vercel', 'not_started', 0, 1),
    svc('cloudflare', 'Cloudflare', 'cloudflare', 'connected', 2, 2, true),
    svc('firebase', 'Firebase', 'firebase', 'not_started', 0, 3),

    // Bottom-center: GitHub
    svc('github', 'GitHub', 'github', 'connected', 2, 2, true),
];

/* ─────────────────── Edge styles ─────────────────── */
const connectedStyle = {
    stroke: 'var(--brand-green)', strokeWidth: 2,
    filter: 'drop-shadow(0 0 4px var(--brand-green))',
};
const connectedHoverStyle = {
    stroke: 'var(--brand-green)', strokeWidth: 3,
    filter: 'drop-shadow(0 0 10px var(--brand-green))',
};
const blueStyle = {
    stroke: 'var(--brand-blue)', strokeWidth: 2,
    filter: 'drop-shadow(0 0 4px var(--brand-blue))',
};
const blueHoverStyle = {
    stroke: 'var(--brand-blue)', strokeWidth: 3,
    filter: 'drop-shadow(0 0 10px var(--brand-blue))',
};
const disconnectedStyle = {
    stroke: 'var(--muted-foreground)', strokeWidth: 1.5,
    strokeDasharray: '6 4', opacity: 0.3,
};
const disconnectedHoverStyle = {
    stroke: 'var(--muted-foreground)', strokeWidth: 2.5,
    strokeDasharray: '6 4', opacity: 0.65,
};
const labelStyle = { fontSize: 10, fontWeight: 500, fill: 'var(--muted-foreground)' };
const labelBgStyle = { fill: 'var(--flow-label-bg, #1a1e2e)', fillOpacity: 0.85 };
const hoverLabelStyle = { fontSize: 11, fontWeight: 600, fill: 'var(--foreground)' };

function edge(id: string, source: string, target: string, label: string, style: Record<string, unknown>, animated = true): Edge {
    return { id, source, target, type: 'smoothstep', animated, label, labelStyle, labelBgStyle, style };
}

/* ─────────────────── Edges (9) ─────────────────── */
const baseEdges: Edge[] = [
    // Auth → My App
    edge('e-google-myapp', 'google', 'myapp', 'GOOGLE_CLIENT_ID', connectedStyle),
    edge('e-kakao-myapp', 'kakao', 'myapp', 'KAKAO_REST_KEY', connectedStyle),
    edge('e-naver-myapp', 'naver', 'myapp', 'NAVER_CLIENT_ID', disconnectedStyle, false),
    // My App → GitHub
    edge('e-myapp-github', 'myapp', 'github', 'GITHUB_TOKEN', blueStyle),
    // My App → AI
    edge('e-myapp-openai', 'myapp', 'openai', 'OPENAI_API_KEY', connectedStyle),
    edge('e-myapp-gemini', 'myapp', 'gemini', 'GEMINI_API_KEY', disconnectedStyle, false),
    // My App → Deploy
    edge('e-myapp-vercel', 'myapp', 'vercel', 'VERCEL_TOKEN', disconnectedStyle, false),
    edge('e-myapp-cloudflare', 'myapp', 'cloudflare', 'CF_API_TOKEN', connectedStyle),
    edge('e-myapp-firebase', 'myapp', 'firebase', 'FIREBASE_CONFIG', disconnectedStyle, false),
];

/* ─────────────────── Component ─────────────────── */
export function InteractiveHeroFlow() {
    const [hoveredEdge, setHoveredEdge] = useState<string | null>(null);

    const currentNodes = useMemo(() => {
        const isClient = typeof window !== 'undefined';
        const cx = isClient ? window.innerWidth / 2 : 700;
        const cy = 190;

        return baseNodes.map(n => {
            const clone = { ...n, position: { ...n.position } };
            // ── Group labels ──
            if (n.id === 'g-auth')   clone.position = { x: cx - 520, y: cy - 60 };
            if (n.id === 'g-ai')     clone.position = { x: cx + 260, y: cy - 110 };
            if (n.id === 'g-deploy') clone.position = { x: cx + 260, y: cy + 70 };
            // ── Center ──
            if (n.id === 'myapp')    clone.position = { x: cx - 80, y: cy };
            // ── Auth (left) ──
            if (n.id === 'google')   clone.position = { x: cx - 380, y: cy - 80 };
            if (n.id === 'kakao')    clone.position = { x: cx - 380, y: cy + 10 };
            if (n.id === 'naver')    clone.position = { x: cx - 380, y: cy + 100 };
            // ── GitHub (bottom-center) ──
            if (n.id === 'github')   clone.position = { x: cx - 40, y: cy + 170 };
            // ── AI (right-top) ──
            if (n.id === 'openai')   clone.position = { x: cx + 300, y: cy - 70 };
            if (n.id === 'gemini')   clone.position = { x: cx + 300, y: cy + 10 };
            // ── Deploy (right-bottom) ──
            if (n.id === 'vercel')     clone.position = { x: cx + 300, y: cy + 110 };
            if (n.id === 'cloudflare') clone.position = { x: cx + 300, y: cy + 190 };
            if (n.id === 'firebase')   clone.position = { x: cx + 300, y: cy + 270 };
            return clone;
        });
    }, []);

    const currentEdges = useMemo(() => {
        return baseEdges.map(e => {
            if (hoveredEdge !== e.id) return e;
            const isDisconnected = DISCONNECTED_IDS.has(e.id);
            const isBlue = e.id === 'e-myapp-github';
            return {
                ...e,
                style: isDisconnected ? disconnectedHoverStyle : isBlue ? blueHoverStyle : connectedHoverStyle,
                labelStyle: hoverLabelStyle,
                labelBgStyle: { ...labelBgStyle, fillOpacity: 1 },
                zIndex: 10,
            };
        });
    }, [hoveredEdge]);

    const onEdgeMouseEnter: EdgeMouseHandler = useCallback((_event, edge) => {
        setHoveredEdge(edge.id);
    }, []);

    const onEdgeMouseLeave: EdgeMouseHandler = useCallback(() => {
        setHoveredEdge(null);
    }, []);

    return (
        <div className="absolute inset-0 z-0 opacity-80 dark:opacity-90">
            <ReactFlow
                nodes={currentNodes}
                edges={currentEdges}
                nodeTypes={nodeTypes}
                connectionLineType={ConnectionLineType.SmoothStep}
                onEdgeMouseEnter={onEdgeMouseEnter}
                onEdgeMouseLeave={onEdgeMouseLeave}
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
                <Background variant={BackgroundVariant.Dots} gap={24} size={2} color="var(--dot-color, #334155)" />
            </ReactFlow>
        </div>
    );
}
