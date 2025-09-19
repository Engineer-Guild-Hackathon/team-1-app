// src/components/Roadmap.tsx
import React, { useState, useEffect } from 'react';
import ReactFlow, { Background, Controls, Edge, Node } from 'reactflow';
import 'reactflow/dist/style.css';

interface RoadmapProps {
    roadmapId: string;
}

const Roadmap: React.FC<RoadmapProps> = ({ roadmapId }) => {
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);

    useEffect(() => {
        // Fetch roadmap data from the backend
        const fetchRoadmap = async () => {
            try {
                const response = await fetch(`/api/roadmaps/${roadmapId}`);
                const data = await response.json();

                // Transform data into nodes and edges
                const fetchedNodes = data.graphData.nodes.map((node: any) => ({
                    id: node.id,
                    data: { label: node.label },
                    position: node.position,
                }));

                const fetchedEdges = data.graphData.edges.map((edge: any) => ({
                    id: edge.id,
                    source: edge.source,
                    target: edge.target,
                }));

                setNodes(fetchedNodes);
                setEdges(fetchedEdges);
            } catch (error) {
                console.error('Failed to fetch roadmap:', error);
            }
        };

        fetchRoadmap();
    }, [roadmapId]);

    return (
        <div style={{ height: '500px', width: '100%' }}>
            <ReactFlow nodes={nodes} edges={edges}>
                <Background />
                <Controls />
            </ReactFlow>
        </div>
    );
};

export default Roadmap;