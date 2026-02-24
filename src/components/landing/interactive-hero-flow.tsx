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
import { getServiceEmoji } from '@/lib/constants/service-brands';

const nodeTypes = {
    layer: FlowLayerNode,
    service: FlowServiceNode,
};

/* ── Nodes ── */
const baseNodes: Node[] = [
    // Center: My App
    {
        id: 'myapp',
        type: 'layer',
        position: { x: 0, y: 0 },
        data: { label: 'My App', emoji: getServiceEmoji('nextjs'), iconSlug: 'nextjs', layer: 'frontend', highlighted: true },
        draggable: false,
        selectable: false,
    },
    // Left: Auth providers
    {
        id: 'google',
        type: 'service',
        position: { x: 0, y: 0 },
        data: { label: 'Google', emoji: getServiceEmoji('google-oauth'), iconSlug: 'google-oauth', status: 'connected', envConfigured: 1, envTotal: 1 },
        draggable: false,
        selectable: false,
    },
    {
        id: 'kakao',
        type: 'service',
        position: { x: 0, y: 0 },
        data: { label: 'Kakao', emoji: getServiceEmoji('kakao-login'), iconSlug: 'kakao-login', status: 'connected', envConfigured: 2, envTotal: 2 },
        draggable: false,
        selectable: false,
    },
    // Bottom-center: GitHub
    {
        id: 'github',
        type: 'service',
        position: { x: 0, y: 0 },
        data: { label: 'GitHub', emoji: getServiceEmoji('github'), iconSlug: 'github', status: 'connected', envConfigured: 2, envTotal: 2, highlighted: true },
        draggable: false,
        selectable: false,
    },
    // Right: AI services
    {
        id: 'openai',
        type: 'service',
        position: { x: 0, y: 0 },
        data: { label: 'OpenAI', emoji: getServiceEmoji('openai'), iconSlug: 'openai', status: 'connected', envConfigured: 1, envTotal: 1 },
        draggable: false,
        selectable: false,
    },
    {
        id: 'gemini',
        type: 'service',
        position: { x: 0, y: 0 },
        data: { label: 'Gemini', emoji: getServiceEmoji('google-gemini'), iconSlug: 'google-gemini', status: 'not_started', envConfigured: 0, envTotal: 1 },
        draggable: false,
        selectable: false,
    },
];

/* ── Edge styles ── */
const connectedStyle = {
    stroke: 'var(--brand-green)',
    strokeWidth: 2,
    filter: 'drop-shadow(0 0 6px var(--brand-green))',
};
const connectedHoverStyle = {
    stroke: 'var(--brand-green)',
    strokeWidth: 3,
    filter: 'drop-shadow(0 0 12px var(--brand-green))',
};
const disconnectedStyle = {
    stroke: 'var(--muted-foreground)',
    strokeWidth: 1.5,
    strokeDasharray: '6 4',
    opacity: 0.35,
};
const disconnectedHoverStyle = {
    stroke: 'var(--muted-foreground)',
    strokeWidth: 2.5,
    strokeDasharray: '6 4',
    opacity: 0.7,
};
const labelStyle = { fontSize: 10, fontWeight: 500, fill: 'var(--muted-foreground)' };
const labelBgStyle = { fill: 'var(--flow-label-bg, #1a1e2e)', fillOpacity: 0.85 };
const hoverLabelStyle = { fontSize: 11, fontWeight: 600, fill: 'var(--foreground)' };

/* ── Edges ── */
const baseEdges: Edge[] = [
    // Auth → My App
    {
        id: 'e-google-myapp',
        source: 'google',
        target: 'myapp',
        type: 'smoothstep',
        animated: true,
        label: 'GOOGLE_CLIENT_ID',
        labelStyle,
        labelBgStyle,
        style: connectedStyle,
    },
    {
        id: 'e-kakao-myapp',
        source: 'kakao',
        target: 'myapp',
        type: 'smoothstep',
        animated: true,
        label: 'KAKAO_REST_KEY',
        labelStyle,
        labelBgStyle,
        style: connectedStyle,
    },
    // My App → GitHub
    {
        id: 'e-myapp-github',
        source: 'myapp',
        target: 'github',
        type: 'smoothstep',
        animated: true,
        label: 'GITHUB_TOKEN',
        labelStyle,
        labelBgStyle,
        style: { stroke: 'var(--brand-blue)', strokeWidth: 2, filter: 'drop-shadow(0 0 6px var(--brand-blue))' },
    },
    // My App → OpenAI (connected)
    {
        id: 'e-myapp-openai',
        source: 'myapp',
        target: 'openai',
        type: 'smoothstep',
        animated: true,
        label: 'OPENAI_API_KEY',
        labelStyle,
        labelBgStyle,
        style: connectedStyle,
    },
    // My App → Gemini (not connected)
    {
        id: 'e-myapp-gemini',
        source: 'myapp',
        target: 'gemini',
        type: 'smoothstep',
        animated: false,
        label: 'GEMINI_API_KEY',
        labelStyle,
        labelBgStyle,
        style: disconnectedStyle,
    },
];

export function InteractiveHeroFlow() {
    const [hoveredEdge, setHoveredEdge] = useState<string | null>(null);

    const currentNodes = useMemo(() => {
        const isClient = typeof window !== 'undefined';
        const cx = isClient ? window.innerWidth / 2 : 700;
        const cy = 170; // vertical center of the 340-400px showcase area

        return baseNodes.map(n => {
            const clone = { ...n, position: { ...n.position } };
            // Layout: left auth → center app → bottom github → right AI
            if (n.id === 'google')  clone.position = { x: cx - 380, y: cy - 60 };
            if (n.id === 'kakao')   clone.position = { x: cx - 380, y: cy + 60 };
            if (n.id === 'myapp')   clone.position = { x: cx - 80,  y: cy };
            if (n.id === 'github')  clone.position = { x: cx - 40,  y: cy + 150 };
            if (n.id === 'openai')  clone.position = { x: cx + 240, y: cy - 60 };
            if (n.id === 'gemini')  clone.position = { x: cx + 240, y: cy + 60 };
            return clone;
        });
    }, []);

    // Edges with hover highlight
    const currentEdges = useMemo(() => {
        return baseEdges.map(e => {
            if (hoveredEdge !== e.id) return e;
            const isDisconnected = e.id === 'e-myapp-gemini';
            return {
                ...e,
                style: isDisconnected ? disconnectedHoverStyle : connectedHoverStyle,
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
