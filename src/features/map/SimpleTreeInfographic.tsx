import React, { useEffect, useMemo, useState } from "react";
import type { Topic, Subtopic } from "./types";
import ProgressPill from "./ProgressPill";

/** Simple, clean tree implementation */
export default function SimpleTreeInfographic({
  topics,
  mapId = "default",
  height = 720,
  width = 1200,
}: {
  topics: Topic[];
  mapId?: string;
  height?: number;
  width?: number;
}) {
  const [zoom, setZoom] = useState(1);
  
  // Flatten subtopics
  const subs = useMemo(() => {
    const result: Array<{ topicId: string; sub: Subtopic }> = [];
    for (const t of topics) {
      for (const s of t.subtopics) {
        result.push({ topicId: t.id, sub: s });
      }
    }
    return result;
  }, [topics]);

  const padX = 48, padY = 56;
  const W = Math.max(width, 900), H = Math.max(height, 600);
  const centerX = W / 2;
  const centerY = H - padY;
  
  // Create 5 main branches radiating from center
  const mainBranches = Array.from({ length: 5 }, (_, i) => {
    const angle = (i * 72) * Math.PI / 180; // 72 degrees apart
    const radius = H * 0.4; // Length of main branches
    
    return {
      id: i,
      angle,
      endX: centerX + Math.cos(angle) * radius,
      endY: centerY + Math.sin(angle) * radius,
    };
  });

  // Create 3 sub-branches per main branch
  const allNodes = mainBranches.flatMap((mainBranch, mainIndex) => {
    return Array.from({ length: 3 }, (_, subIndex) => {
      const subAngle = mainBranch.angle + (subIndex - 1) * 0.5; // ±0.5 radians spread
      const subRadius = H * 0.25; // Length of sub-branches
      
      const nodeX = mainBranch.endX + Math.cos(subAngle) * subRadius;
      const nodeY = mainBranch.endY + Math.sin(subAngle) * subRadius;
      
      // Map to subtopics
      const subTopicIndex = (mainIndex * 3 + subIndex) % subs.length;
      const sub = subs[subTopicIndex];
      
      return {
        id: `${mainIndex}-${subIndex}`,
        mainIndex,
        subIndex,
        subId: sub.sub.id,
        title: sub.sub.title,
        x: nodeX,
        y: nodeY,
        mainEndX: mainBranch.endX,
        mainEndY: mainBranch.endY,
      };
    });
  });

  const handleZoom = (delta: number) => {
    setZoom(prev => Math.max(0.3, Math.min(3, prev + delta)));
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-emerald-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      {/* Debug Info */}
      <div className="absolute top-4 right-4 z-20 bg-blue-500 text-white p-2 rounded text-xs">
        SIMPLE TREE v1.0 - {mainBranches.length} main, {allNodes.length} nodes
      </div>

      {/* Zoom Controls */}
      <div className="absolute top-4 left-4 z-20 flex gap-2">
        <button
          onClick={() => handleZoom(0.2)}
          className="px-3 py-1.5 bg-white/90 dark:bg-slate-800/90 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium hover:bg-white dark:hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          +
        </button>
        <button
          onClick={() => handleZoom(-0.2)}
          className="px-3 py-1.5 bg-white/90 dark:bg-slate-800/90 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium hover:bg-white dark:hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          -
        </button>
        <span className="px-2 py-1.5 bg-white/90 dark:bg-slate-800/90 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400">
          {Math.round(zoom * 100)}%
        </span>
      </div>

      <div 
        className="relative overflow-auto" 
        style={{ width: W, height: H }}
      >
        <div
          className="relative origin-center transition-transform duration-200"
          style={{ 
            transform: `scale(${zoom})`,
            width: W,
            height: H
          }}
        >
          {/* SVG Tree */}
          <svg className="absolute inset-0 w-full h-full" aria-hidden="true">
            <defs>
              <linearGradient id="treeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8b4513" />
                <stop offset="100%" stopColor="#a0522d" />
              </linearGradient>
            </defs>

            {/* Ground */}
            <rect x="0" y={H - 30} width={W} height="30" className="fill-emerald-700/40" />
            
            {/* Roots */}
            <line x1={centerX - 20} y1={H - 30} x2={centerX - 40} y2={H - 50} stroke="#8b4513" strokeWidth="4" />
            <line x1={centerX + 20} y1={H - 30} x2={centerX + 40} y2={H - 50} stroke="#8b4513" strokeWidth="4" />
            <line x1={centerX - 10} y1={H - 30} x2={centerX - 30} y2={H - 60} stroke="#8b4513" strokeWidth="3" />
            <line x1={centerX + 10} y1={H - 30} x2={centerX + 30} y2={H - 60} stroke="#8b4513" strokeWidth="3" />

            {/* Main trunk */}
            <line
              x1={centerX}
              y1={centerY}
              x2={centerX}
              y2={centerY - H * 0.2}
              stroke="url(#treeGradient)"
              strokeWidth="20"
              strokeLinecap="round"
            />

            {/* 5 Main branches */}
            {mainBranches.map((branch, i) => (
              <line
                key={`main-${i}`}
                x1={centerX}
                y1={centerY - H * 0.2}
                x2={branch.endX}
                y2={branch.endY}
                stroke="url(#treeGradient)"
                strokeWidth={12 - i}
                strokeLinecap="round"
              />
            ))}

            {/* 15 Sub-branches */}
            {allNodes.map((node) => (
              <line
                key={`sub-${node.id}`}
                x1={node.mainEndX}
                y1={node.mainEndY}
                x2={node.x}
                y2={node.y}
                stroke="url(#treeGradient)"
                strokeWidth="6"
                strokeLinecap="round"
              />
            ))}
          </svg>

          {/* Interactive Nodes */}
          {allNodes.map((node, i) => {
            const colors = ["#60a5fa", "#34d399", "#f59e0b", "#ef4444", "#a78bfa", "#f97316", "#22c55e", "#06b6d4"];
            const color = colors[i % colors.length];
            
            return (
              <div
                key={`node-${node.id}`}
                className="absolute"
                style={{ 
                  left: node.x, 
                  top: node.y, 
                  transform: "translate(-50%, -50%)" 
                }}
              >
                {/* Node circle */}
                <button
                  className="w-12 h-12 rounded-full shadow-lg border-2 border-white/80 flex items-center justify-center text-white font-medium text-xs hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  title={node.title}
                >
                  {i + 1}
                </button>

                {/* Label */}
                <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 text-center">
                  <div className="bg-white/95 dark:bg-slate-900/95 rounded-lg px-2 py-1 text-xs font-medium text-slate-900 dark:text-slate-100 shadow-md border border-slate-200 dark:border-slate-700 whitespace-nowrap max-w-[120px]">
                    {node.title}
                  </div>
                  <ProgressPill known={0} total={0} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


