'use client';

import React, { useEffect, useMemo } from 'react';
import ReactFlow, {
    Background,
    Controls,
    Edge,
    Node,
    useNodesState,
    useEdgesState,
    MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { NodeProgress } from '../../backendjs/src/types';

interface RoadmapDisplayProps {
    initialNodes: Node[];
    initialEdges: Edge[];
    nodeProgress: NodeProgress[];
}

const RoadmapDisplay: React.FC<RoadmapDisplayProps> = ({
                                                           initialNodes,
                                                           initialEdges,
                                                           nodeProgress,
                                                       }) => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const styledNodes = useMemo(() => {
        const progressMap = new Map(nodeProgress.map((p) => [p.nodeId, p.status]));

        return initialNodes.map((node) => {
            const status = progressMap.get(node.id) || 'not_started';
            let style = {};
            switch (status) {
                case 'completed':
                    style = { background: '#D1FAE5', borderColor: '#10B981' };
                    break;
                case 'next':
                    style = { background: '#DBEAFE', borderColor: '#3B82F6' };
                    break;
                case 'needs_review':
                    style = { background: '#FEF3C7', borderColor: '#F59E0B' };
                    break;
                default: // not_started
                    style = { background: '#F3F4F6', borderColor: '#9CA3AF' };
                    break;
            }
            return {
                ...node,
                style: { ...node.style, ...style, borderWidth: 2, padding: 15 },
            };
        });
    }, [initialNodes, nodeProgress]);

    useEffect(() => {
        setNodes(styledNodes);
        setEdges(initialEdges.map(edge => ({
            ...edge,
            markerEnd: {
                type: MarkerType.ArrowClosed,
                width: 20,
                height: 20,
                color: '#BDBDBD',
            },
            style: {
                strokeWidth: 2,
                stroke: '#BDBDBD',
            },
        })));
    }, [styledNodes, initialEdges, setNodes, setEdges]);


    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            fitView
        >
            <Background />
            <Controls />
        </ReactFlow>
    );
};

export default RoadmapDisplay;