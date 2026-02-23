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

const nodes: Node[] = [
    {
        id: 'nextjs',
        type: 'layer',
        position: { x: window.innerWidth / 2 - 200, y: window.innerHeight / 2 - 100 },
        data: { label: 'My App', emoji: getServiceEmoji('nextjs'), iconSlug: 'nextjs', layer: 'frontend', highlighted: true },
        draggable: false,
        selectable: false,
    },
    {
        id: 'supabase',
        type: 'service',
        position: { x: window.innerWidth / 2 + 150, y: window.innerHeight / 2 - 200 },
        data: { label: 'Supabase', emoji: getServiceEmoji('supabase'), iconSlug: 'supabase', status: 'connected', envConfigured: 3, envTotal: 3, highlighted: true },
        draggable: false,
        selectable: false,
    },
    {
        id: 'stripe',
        type: 'service',
        position: { x: window.innerWidth / 2 + 200, y: window.innerHeight / 2 + 50 },
        data: { label: 'Stripe', emoji: getServiceEmoji('stripe'), iconSlug: 'stripe', status: 'in_progress', envConfigured: 1, envTotal: 2, highlighted: true },
        draggable: false,
        selectable: false,
    },
    {
        id: 'openai',
        type: 'service',
        position: { x: window.innerWidth / 2 - 400, y: window.innerHeight / 2 - 50 },
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
        // Avoid SSR window issues by setting positions dynamically or roughly
        const isClient = typeof window !== 'undefined';
        const cx = isClient ? window.innerWidth / 2 : 600;
        const cy = isClient ? window.innerHeight / 2 : 400;
        return nodes.map(n => {
            if (n.id === 'nextjs') n.position = { x: cx - 180, y: cy - 50 };
            if (n.id === 'supabase') n.position = { x: cx + 180, y: cy - 150 };
            if (n.id === 'stripe') n.position = { x: cx + 220, y: cy + 100 };
            if (n.id === 'openai') n.position = { x: cx - 400, y: cy - 50 };
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
