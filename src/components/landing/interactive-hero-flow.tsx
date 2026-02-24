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

const DISCONNECTED_IDS = new Set(['e-naver-myapp', 'e-myapp-gemini', 'e-myapp-vercel', 'e-firebase-myapp']);

/* ── Group region dimensions ── */
const GP = 16;          // padding inside region
const GW = 190;         // group region width
const NODE_H = 54;      // approx service node rendered height

/* ─────────────────── Nodes ─────────────────── */
const baseNodes: Node[] = [
    // ── Group regions ──
    { id: 'g-db',     type: 'group', position: { x: 0, y: 0 }, data: { label: '🗄️ DATABASE', colorHint: 'amber'  }, style: { width: GW, height: 0, overflow: 'visible' }, zIndex: -1, draggable: false, selectable: false },
    { id: 'g-auth',   type: 'group', position: { x: 0, y: 0 }, data: { label: '🔐 AUTH',     colorHint: 'green'  }, style: { width: GW, height: 0, overflow: 'visible' }, zIndex: -1, draggable: false, selectable: false },
    { id: 'g-ai',     type: 'group', position: { x: 0, y: 0 }, data: { label: '🤖 AI',       colorHint: 'purple' }, style: { width: GW, height: 0, overflow: 'visible' }, zIndex: -1, draggable: false, selectable: false },
    { id: 'g-deploy', type: 'group', position: { x: 0, y: 0 }, data: { label: '🚀 DEPLOY',   colorHint: 'blue'   }, style: { width: GW, height: 0, overflow: 'visible' }, zIndex: -1, draggable: false, selectable: false },

    // ── Database (top-center) ──
    svc('supabase', 'Supabase', 'supabase', 'connected',   2, 2, 'SUPABASE_URL'),
    svc('firebase', 'Firebase', 'firebase', 'not_started', 0, 3, 'FIREBASE_CONFIG'),

    // ── Center hub ──
    {
        id: 'myapp', type: 'layer', position: { x: 0, y: 0 },
        data: { label: 'My App', emoji: getServiceEmoji('nextjs'), iconSlug: 'nextjs', layer: 'frontend', highlighted: true },
        draggable: false, selectable: false,
    },

    // ── Auth (left) ──
    svc('google',     'Google', 'google-oauth',  'connected',   1, 1, 'GOOGLE_CLIENT_ID'),
    svc('kakao',      'Kakao',  'kakao-login',   'connected',   2, 2, 'KAKAO_REST_KEY'),
    svc('naver',      'Naver',  'naver-login',   'not_started', 0, 2, 'NAVER_CLIENT_ID'),

    // ── AI (right-top) ──
    svc('openai',     'OpenAI', 'openai',        'connected',   1, 1, 'OPENAI_API_KEY'),
    svc('gemini',     'Gemini', 'google-gemini', 'not_started', 0, 1, 'GEMINI_API_KEY'),

    // ── Deploy (right-bottom) ──
    svc('vercel',     'Vercel',      'vercel',     'not_started', 0, 1, 'VERCEL_TOKEN'),
    svc('cloudflare', 'Cloudflare',  'cloudflare', 'connected',   2, 2, 'CF_API_TOKEN', true),

    // ── GitHub (bottom-center) ──
    svc('github', 'GitHub', 'github', 'connected', 2, 2, 'GITHUB_TOKEN', true),
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

function edge(
    id: string, source: string, target: string,
    style: Record<string, unknown>,
    animated = true,
    sourceHandle?: string,
    targetHandle?: string,
): Edge {
    const e: Edge = { id, source, target, type: 'smoothstep', animated, style };
    if (sourceHandle) e.sourceHandle = sourceHandle;
    if (targetHandle) e.targetHandle = targetHandle;
    return e;
}

/* ─────────────────── Edges ─────────────────── */
const baseEdges: Edge[] = [
    // DB → myapp (top)
    edge('e-supabase-myapp', 'supabase', 'myapp', connectedStyle,    true,  'bottom', 'top'),
    edge('e-firebase-myapp', 'firebase', 'myapp', disconnectedStyle, false, 'bottom', 'top'),
    // Auth → myapp
    edge('e-google-myapp',   'google',   'myapp', connectedStyle),
    edge('e-kakao-myapp',    'kakao',    'myapp', connectedStyle),
    edge('e-naver-myapp',    'naver',    'myapp', disconnectedStyle, false),
    // myapp → GitHub
    edge('e-myapp-github',   'myapp', 'github',     blueStyle,        true,  'bottom'),
    // myapp → AI
    edge('e-myapp-openai',   'myapp', 'openai',     connectedStyle),
    edge('e-myapp-gemini',   'myapp', 'gemini',     disconnectedStyle, false),
    // myapp → Deploy
    edge('e-myapp-vercel',   'myapp', 'vercel',     disconnectedStyle, false),
    edge('e-myapp-cloudflare','myapp','cloudflare',  connectedStyle),
];

/* ─────────────────── Layout ─────────────────── */
const CY = 200;   // vertical center of main service ring

/* ─────────────────── Component ─────────────────── */
export function InteractiveHeroFlow() {
    const [hoveredEdge, setHoveredEdge] = useState<string | null>(null);

    const currentNodes = useMemo(() => {
        const isClient = typeof window !== 'undefined';
        const cx = isClient ? window.innerWidth / 2 : 700;

        const positions: Record<string, { x: number; y: number }> = {
            // ── Database (top-center, stacked vertically above myapp) ──
            supabase:   { x: cx - 90, y: 20 },
            firebase:   { x: cx - 90, y: 90 },
            // ── Auth (left) ──
            google:     { x: cx - 370, y: CY - 55 },
            kakao:      { x: cx - 370, y: CY + 15 },
            naver:      { x: cx - 370, y: CY + 85 },
            // ── Center ──
            myapp:      { x: cx - 80,  y: CY + 10 },
            // ── GitHub (bottom-center) ──
            github:     { x: cx - 40,  y: CY + 175 },
            // ── AI (right-top) ──
            openai:     { x: cx + 300, y: CY - 45 },
            gemini:     { x: cx + 300, y: CY + 20 },
            // ── Deploy (right-bottom) ──
            vercel:     { x: cx + 300, y: CY + 125 },
            cloudflare: { x: cx + 300, y: CY + 190 },
        };

        // ── Group bounding boxes ──
        const dbTop     = positions.supabase.y;
        const dbBot     = positions.firebase.y + NODE_H;
        const authTop   = positions.google.y;
        const authBot   = positions.naver.y + NODE_H;
        const aiTop     = positions.openai.y;
        const aiBot     = positions.gemini.y + NODE_H;
        const deployTop = positions.vercel.y;
        const deployBot = positions.cloudflare.y + NODE_H;

        const groupPositions: Record<string, { x: number; y: number; h: number }> = {
            'g-db':     { x: positions.supabase.x - GP, y: dbTop - GP,     h: (dbBot - dbTop) + GP * 2 },
            'g-auth':   { x: positions.google.x - GP,   y: authTop - GP,   h: (authBot - authTop) + GP * 2 },
            'g-ai':     { x: positions.openai.x - GP,   y: aiTop - GP,     h: (aiBot - aiTop) + GP * 2 },
            'g-deploy': { x: positions.vercel.x - GP,   y: deployTop - GP, h: (deployBot - deployTop) + GP * 2 },
        };

        return baseNodes.map(n => {
            const clone = { ...n, position: { ...n.position }, style: n.style ? { ...n.style } : undefined };
            const gp = groupPositions[n.id];
            if (gp) {
                clone.position = { x: gp.x, y: gp.y };
                if (clone.style) clone.style.height = gp.h;
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
