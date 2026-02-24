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

const DISCONNECTED_IDS = new Set(['e-naver-myapp', 'e-myapp-gemini', 'e-myapp-vercel', 'e-myapp-firebase']);

/* ─────────────────── Nodes ─────────────────── */
const baseNodes: Node[] = [
    // ── Group regions (behind service nodes) ──
    { id: 'g-auth', type: 'group', position: { x: 0, y: 0 }, data: { label: '🔐 AUTH', colorHint: 'green' }, style: { width: 195, height: 250 }, zIndex: -1, draggable: false, selectable: false },
    { id: 'g-ai', type: 'group', position: { x: 0, y: 0 }, data: { label: '🤖 AI', colorHint: 'purple' }, style: { width: 195, height: 168 }, zIndex: -1, draggable: false, selectable: false },
    { id: 'g-deploy', type: 'group', position: { x: 0, y: 0 }, data: { label: '🚀 DEPLOY', colorHint: 'blue' }, style: { width: 195, height: 232 }, zIndex: -1, draggable: false, selectable: false },

    // ── Center hub ──
    {
        id: 'myapp', type: 'layer', position: { x: 0, y: 0 },
        data: { label: 'My App', emoji: getServiceEmoji('nextjs'), iconSlug: 'nextjs', layer: 'frontend', highlighted: true },
        draggable: false, selectable: false,
    },

    // ── Auth (left) ──
    svc('google', 'Google', 'google-oauth', 'connected', 1, 1, 'GOOGLE_CLIENT_ID'),
    svc('kakao', 'Kakao', 'kakao-login', 'connected', 2, 2, 'KAKAO_REST_KEY'),
    svc('naver', 'Naver', 'naver-login', 'not_started', 0, 2, 'NAVER_CLIENT_ID'),

    // ── AI (right-top) ──
    svc('openai', 'OpenAI', 'openai', 'connected', 1, 1, 'OPENAI_API_KEY'),
    svc('gemini', 'Gemini', 'google-gemini', 'not_started', 0, 1, 'GEMINI_API_KEY'),

    // ── Deploy (right-bottom) ──
    svc('vercel', 'Vercel', 'vercel', 'not_started', 0, 1, 'VERCEL_TOKEN'),
    svc('cloudflare', 'Cloudflare', 'cloudflare', 'connected', 2, 2, 'CF_API_TOKEN', true),
    svc('firebase', 'Firebase', 'firebase', 'not_started', 0, 3, 'FIREBASE_CONFIG'),

    // ── GitHub (bottom-center) ──
    svc('github', 'GitHub', 'github', 'connected', 2, 2, 'GITHUB_TOKEN', true),
];

/* ─────────────────── Edge styles (clean, no labels) ─────────────────── */
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

function edge(id: string, source: string, target: string, style: Record<string, unknown>, animated = true, sourceHandle?: string): Edge {
    const e: Edge = { id, source, target, type: 'smoothstep', animated, style };
    if (sourceHandle) e.sourceHandle = sourceHandle;
    return e;
}

/* ─────────────────── Edges ─────────────────── */
const baseEdges: Edge[] = [
    edge('e-google-myapp', 'google', 'myapp', connectedStyle),
    edge('e-kakao-myapp', 'kakao', 'myapp', connectedStyle),
    edge('e-naver-myapp', 'naver', 'myapp', disconnectedStyle, false),
    edge('e-myapp-github', 'myapp', 'github', blueStyle, true, 'bottom'),
    edge('e-myapp-openai', 'myapp', 'openai', connectedStyle),
    edge('e-myapp-gemini', 'myapp', 'gemini', disconnectedStyle, false),
    edge('e-myapp-vercel', 'myapp', 'vercel', disconnectedStyle, false),
    edge('e-myapp-cloudflare', 'myapp', 'cloudflare', connectedStyle),
    edge('e-myapp-firebase', 'myapp', 'firebase', disconnectedStyle, false),
];

/* ─────────────────── Layout ─────────────────── */
const CY = 190;
const GROUP_PAD_X = 20;
const GROUP_PAD_TOP = 30;

/* ─────────────────── Component ─────────────────── */
export function InteractiveHeroFlow() {
    const [hoveredEdge, setHoveredEdge] = useState<string | null>(null);

    const currentNodes = useMemo(() => {
        const isClient = typeof window !== 'undefined';
        const cx = isClient ? window.innerWidth / 2 : 700;

        const positions: Record<string, { x: number; y: number }> = {
            // Auth (left)
            google:     { x: cx - 370, y: CY - 60 },
            kakao:      { x: cx - 370, y: CY + 12 },
            naver:      { x: cx - 370, y: CY + 84 },
            // Center
            myapp:      { x: cx - 80,  y: CY + 5 },
            // GitHub (bottom-center)
            github:     { x: cx - 40,  y: CY + 175 },
            // AI (right-top)
            openai:     { x: cx + 300, y: CY - 50 },
            gemini:     { x: cx + 300, y: CY + 18 },
            // Deploy (right-bottom)
            vercel:     { x: cx + 300, y: CY + 120 },
            cloudflare: { x: cx + 300, y: CY + 190 },
            firebase:   { x: cx + 300, y: CY + 260 },
        };

        const groupPositions: Record<string, { x: number; y: number }> = {
            'g-auth':   { x: positions.google.x - GROUP_PAD_X, y: positions.google.y - GROUP_PAD_TOP },
            'g-ai':     { x: positions.openai.x - GROUP_PAD_X, y: positions.openai.y - GROUP_PAD_TOP },
            'g-deploy': { x: positions.vercel.x - GROUP_PAD_X, y: positions.vercel.y - GROUP_PAD_TOP },
        };

        return baseNodes.map(n => {
            const clone = { ...n, position: { ...n.position } };
            if (groupPositions[n.id]) {
                clone.position = groupPositions[n.id];
            } else if (positions[n.id]) {
                clone.position = positions[n.id];
            }
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

    return (
        <div className="absolute inset-0 z-0 opacity-85 dark:opacity-90">
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
                <Background variant={BackgroundVariant.Dots} gap={24} size={1.5} color="var(--dot-color, #334155)" />
            </ReactFlow>
        </div>
    );
}
