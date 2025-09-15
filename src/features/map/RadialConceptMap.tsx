import React, { useState, useMemo } from "react";
import type { Topic, Subtopic } from "./types";
import { ConceptNodeRenderer } from "./ConceptNodeRenderer";
import { ConceptConnectionRenderer } from "./ConceptConnectionRenderer";
import { DebugInfo } from "./DebugInfo";
import { useZoomPan } from "./useZoomPan";

interface RadialConceptMapProps {
  topics: Topic[];
  mapId?: string;
  height?: number;
  width?: number;
}

export default function RadialConceptMap({
  topics,
  mapId = "default",
  height = 720,
  width = 1200,
}: RadialConceptMapProps) {
  const [selectedNode, setSelectedNode] = useState<any>(null);
  
  const {
    scale,
    translateX,
    translateY,
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    resetView,
  } = useZoomPan();

  // Flatten subtopics
  const allSubtopics: Subtopic[] = useMemo(() => {
    const subtopics: Subtopic[] = [];
    for (const topic of topics) {
      for (const subtopic of topic.subtopics) {
        subtopics.push(subtopic);
      }
    }
    return subtopics;
  }, [topics]);

  const W = Math.max(width, 900);
  const H = Math.max(height, 600);
  const centerX = W / 2;
  const centerY = H / 2;
  
  // Create central circle
  const centralNode = useMemo(() => ({
    id: 'central',
    x: centerX,
    y: centerY,
    label: 'Central',
    radius: 35,
    progress: 100,
  }), [centerX, centerY]);

  // Create 5 main categories around center
  const mainCategories = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => {
      const angle = (i * 72) * Math.PI / 180; // 72 degrees apart
      const radius = Math.min(W, H) * 0.3; // Distance from center
      
      return {
        id: i,
        angle,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        label: `Category ${i + 1}`,
        radius: 30,
        progress: Math.random() * 100,
      };
    });
  }, [W, H, centerX, centerY]);

  // Create 3 concepts around each main category
  const concepts = useMemo(() => {
    const conceptList: any[] = [];
    
    mainCategories.forEach((category) => {
      for (let i = 0; i < 3; i++) {
        const angle = category.angle + (i - 1) * 1.2; // Wider spread around category
        const radius = 100; // Greater distance from category
        
        conceptList.push({
          id: `concept-${category.id}-${i}`,
          x: category.x + Math.cos(angle) * radius,
          y: category.y + Math.sin(angle) * radius,
          label: `Concept ${i + 1}`,
          radius: 20,
          progress: Math.random() * 100,
          categoryId: category.id,
        });
      }
    });
    
    return conceptList;
  }, [mainCategories]);

  // Generate connections
  const connections = useMemo(() => {
    const connectionList: any[] = [];
    
    // Connect central node to each category
    mainCategories.forEach((category) => {
      connectionList.push({
        id: `connection-central-${category.id}`,
        from: centralNode,
        to: category,
      });
    });
    
    // Connect each concept to its category only
    concepts.forEach((concept) => {
      const category = mainCategories.find(c => c.id === concept.categoryId);
      if (category) {
        connectionList.push({
          id: `connection-${concept.id}-${category.id}`,
          from: category,
          to: concept,
        });
      }
    });
    
    return connectionList;
  }, [concepts, mainCategories, centralNode]);

  const allNodes = [centralNode, ...mainCategories, ...concepts];

  const handleNodeClick = (node: any) => {
    setSelectedNode(node);
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900" style={{ touchAction: 'none' }}>
      {/* Simple settings panel */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={resetView}
          className="px-3 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-colors"
        >
          Reset View
        </button>
      </div>
      
      <DebugInfo
        scale={scale}
        translateX={translateX}
        translateY={translateY}
        nodeCount={allNodes.length}
        connectionCount={connections.length}
      />
      
      <svg
        width={W}
        height={H}
        className="w-full h-full cursor-grab"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* Simple gradient background */}
        <defs>
          <radialGradient id="backgroundGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="50%" stopColor="#1e3a8a" />
            <stop offset="100%" stopColor="#0f172a" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#backgroundGradient)" />
        
        {/* Only concept map nodes move - background stays fixed */}
        <g
          transform={`translate(${translateX}, ${translateY}) scale(${scale})`}
          style={{ transformOrigin: '0 0' }}
        >
          {/* Render connections */}
          {connections.map((connection) => (
            <ConceptConnectionRenderer
              key={connection.id}
              fromNode={connection.from}
              toNode={connection.to}
              isHighlighted={selectedNode && (
                connection.from.id === selectedNode.id || 
                connection.to.id === selectedNode.id
              )}
            />
          ))}
          
          {/* Render nodes */}
          {allNodes.map((node) => (
            <ConceptNodeRenderer
              key={node.id}
              node={node}
              onNodeClick={handleNodeClick}
              selectedNode={selectedNode}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}