'use client';

import { useMemo } from 'react';
import {
    ReactFlow,
    type Node,
    type Edge,
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

// Initial positions are overridden in useMemo below; these are fallback defaults
const nodes: Node[] = [
    {
        id: 'nextjs',
        type: 'layer',
        position: { x: 400, y: 500 },
        data: { label: 'My App', emoji: getServiceEmoji('nextjs'), iconSlug: 'nextjs', layer: 'frontend', highlighted: true },
        draggable: false,
        selectable: false,
    },
    {
        id: 'supabase',
        type: 'service',
        position: { x: 780, y: 400 },
        data: { label: 'Supabase', emoji: getServiceEmoji('supabase'), iconSlug: 'supabase', status: 'connected', envConfigured: 3, envTotal: 3, highlighted: true },
        draggable: false,
        selectable: false,
    },
    {
        id: 'stripe',
        type: 'service',
        position: { x: 820, y: 650 },
        data: { label: 'Stripe', emoji: getServiceEmoji('stripe'), iconSlug: 'stripe', status: 'in_progress', envConfigured: 1, envTotal: 2, highlighted: true },
        draggable: false,
        selectable: false,
    },
    {
        id: 'openai',
        type: 'service',
        position: { x: 200, y: 500 },
        data: { label: 'OpenAI', emoji: getServiceEmoji('openai'), iconSlug: 'openai', status: 'connected', envConfigured: 1, envTotal: 1, highlighted: false },
        draggable: false,
        selectable: false,
    },
];

const edges: Edge[] = [
    {
        id: 'e-nextjs-supabase',
        source: 'nextjs',
        target: 'supabase',
        type: 'smoothstep',
        animated: true,
        label: 'DATABASE_URL',
        labelStyle: { fontSize: 10, fontWeight: 500, fill: 'var(--muted-foreground)' },
        labelBgStyle: { fill: 'var(--flow-label-bg, #1a1e2e)', fillOpacity: 0.8 },
        style: { stroke: 'var(--brand-green)', strokeWidth: 2, filter: 'drop-shadow(0 0 8px var(--brand-green))' },
        className: 'animate-edge-glow-pulse',
    },
    {
        id: 'e-nextjs-stripe',
        source: 'nextjs',
        target: 'stripe',
        type: 'smoothstep',
        animated: true,
        label: 'STRIPE_SECRET_KEY',
        labelStyle: { fontSize: 10, fontWeight: 500, fill: 'var(--muted-foreground)' },
        labelBgStyle: { fill: 'var(--flow-label-bg, #1a1e2e)', fillOpacity: 0.8 },
        style: { stroke: 'var(--brand-blue)', strokeWidth: 2, filter: 'drop-shadow(0 0 8px var(--brand-blue))' },
        className: 'animate-edge-glow-pulse',
    },
    {
        id: 'e-openai-nextjs',
        source: 'openai',
        target: 'nextjs',
        type: 'smoothstep',
        animated: false,
        style: { stroke: 'var(--flow-edge-color, #334155)', strokeWidth: 1.5, opacity: 0.3 },
    },
];

export function InteractiveHeroFlow() {
    const currentNodes = useMemo(() => {
        // Position nodes well below the hero content to avoid overlap with CTA/trust badges
        const isClient = typeof window !== 'undefined';
        const cx = isClient ? window.innerWidth / 2 : 600;
        const vh = isClient ? window.innerHeight : 800;
        // Push nodes further down — bottom edge of the viewport
        const cy = vh * 0.88;
        return nodes.map(n => {
            if (n.id === 'nextjs') n.position = { x: cx - 180, y: cy };
            if (n.id === 'supabase') n.position = { x: cx + 280, y: cy - 80 };
            if (n.id === 'stripe') n.position = { x: cx + 320, y: cy + 150 };
            if (n.id === 'openai') n.position = { x: cx - 480, y: cy - 40 };
            return n;
        });
    }, []);

    return (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40 dark:opacity-60">
            <ReactFlow
                nodes={currentNodes}
                edges={edges}
                nodeTypes={nodeTypes}
                connectionLineType={ConnectionLineType.SmoothStep}
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
