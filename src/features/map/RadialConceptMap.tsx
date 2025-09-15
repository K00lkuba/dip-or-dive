import React, { useState, useMemo, useRef, useEffect } from "react";
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
  const containerRef = useRef<HTMLDivElement>(null);
  
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

  // Generate random stars for space background
  const stars = useMemo(() => {
    const starList: any[] = [];
    const numStars = 1000;
    
    // Create some high-density star clusters
    const clusters = [
      { x: W * 0.2, y: H * 0.3, radius: 150, density: 0.3 },
      { x: W * 0.8, y: H * 0.2, radius: 120, density: 0.25 },
      { x: W * 0.1, y: H * 0.8, radius: 100, density: 0.2 },
      { x: W * 0.9, y: H * 0.7, radius: 130, density: 0.35 },
    ];
    
    for (let i = 0; i < numStars; i++) {
      let x, y, size, brightness;
      
      // 40% chance to be in a cluster
      if (Math.random() < 0.4) {
        const cluster = clusters[Math.floor(Math.random() * clusters.length)];
        const angle = Math.random() * 2 * Math.PI;
        const distance = Math.random() * cluster.radius;
        x = cluster.x + Math.cos(angle) * distance;
        y = cluster.y + Math.sin(angle) * distance;
        size = Math.random() * 2 + 0.5; // Slightly larger in clusters
        brightness = Math.random() * 0.8 + 0.2; // Brighter in clusters
      } else {
        // Random distribution across the entire map
        x = Math.random() * W;
        y = Math.random() * H;
        size = Math.random() * 1.5 + 0.3;
        brightness = Math.random() * 0.6 + 0.1; // Dimmer outside clusters
      }
      
      starList.push({
        id: `star-${i}`,
        x,
        y,
        size,
        brightness,
      });
    }
    
    return starList;
  }, [W, H]);

  const handleNodeClick = (node: any) => {
    setSelectedNode(node);
  };

  // Global wheel event prevention for map area - but allow zoom to work
  useEffect(() => {
    const handleGlobalWheel = (e: WheelEvent) => {
      const target = e.target as Element;
      const mapContainer = containerRef.current;
      
      // Check if the wheel event is happening over our map
      if (mapContainer && (mapContainer.contains(target) || mapContainer === target)) {
        // Prevent page scroll
        e.preventDefault();
        e.stopPropagation();
        
        // Manually call the zoom logic
        const rect = mapContainer.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        const scaleFactor = e.deltaY > 0 ? 0.9 : 1.1;
        const newScale = Math.max(0.1, Math.min(3, scale * scaleFactor));
        
        // Zoom to cursor position
        const scaleChange = newScale / scale;
        const newTranslateX = mouseX - (mouseX - translateX) * scaleChange;
        const newTranslateY = mouseY - (mouseY - translateY) * scaleChange;
        
        // Update the state directly using the zoom pan hook's state
        // We need to call the zoom handler instead
        const svgElement = mapContainer.querySelector('svg');
        if (svgElement) {
          const syntheticEvent = {
            currentTarget: svgElement,
            clientX: e.clientX,
            clientY: e.clientY,
            deltaY: e.deltaY,
            preventDefault: () => {},
            stopPropagation: () => {}
          } as any;
          
          handleWheel(syntheticEvent);
        }
        
        return false;
      }
    };

    // Add global listener with capture phase
    document.addEventListener('wheel', handleGlobalWheel, { passive: false, capture: true });
    
    return () => {
      document.removeEventListener('wheel', handleGlobalWheel, { capture: true });
    };
  }, [scale, translateX, translateY]);

  return (
    <div 
      ref={containerRef}
      className="concept-map-container relative overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900" 
      style={{ 
        touchAction: 'none',
        overscrollBehavior: 'none',
        position: 'relative',
        zIndex: 1
      }}
    >
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
        onWheel={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleWheel(e);
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* Background and content move together */}
        <g
          transform={`translate(${translateX}, ${translateY}) scale(${scale})`}
          style={{ transformOrigin: '0 0' }}
        >
          {/* Simple gradient background */}
          <defs>
            <radialGradient id="backgroundGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0c0a2e" />
              <stop offset="30%" stopColor="#1a1a2e" />
              <stop offset="60%" stopColor="#16213e" />
              <stop offset="100%" stopColor="#0f0f23" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#backgroundGradient)" />
          
          {/* Render stars */}
          {stars.map((star) => (
            <circle
              key={star.id}
              cx={star.x}
              cy={star.y}
              r={star.size}
              fill={`rgba(255, 255, 255, ${star.brightness})`}
              className="transition-opacity duration-1000"
            />
          ))}
          
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