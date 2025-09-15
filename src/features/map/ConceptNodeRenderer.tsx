import React from 'react';
import { ConceptNode } from './types';

interface ConceptNodeRendererProps {
  node: ConceptNode;
  onNodeClick: (node: ConceptNode) => void;
  selectedNode: ConceptNode | null;
}

export const ConceptNodeRenderer: React.FC<ConceptNodeRendererProps> = ({
  node,
  onNodeClick,
  selectedNode,
}) => {
  const isSelected = selectedNode?.id === node.id;
  const isCompleted = node.progress === 100;
  const isCentral = node.id === 'central';

  return (
    <g
      onClick={() => onNodeClick(node)}
      style={{ cursor: 'pointer' }}
    >
      {/* Glow effect for central node and selected nodes */}
      {(isCentral || isSelected) && (
        <circle
          cx={node.x}
          cy={node.y}
          r={node.radius + 8}
          fill="none"
          stroke={isCentral ? '#fbbf24' : '#3b82f6'}
          strokeWidth="4"
          opacity="0.3"
          filter="url(#glow)"
        />
      )}
      
      {/* Node circle */}
      <circle
        cx={node.x}
        cy={node.y}
        r={node.radius}
        fill={isCentral ? '#fbbf24' : isSelected ? '#3b82f6' : isCompleted ? '#10b981' : '#6b7280'}
        stroke={isCentral ? '#f59e0b' : isSelected ? '#1d4ed8' : '#374151'}
        strokeWidth={isSelected || isCentral ? 3 : 2}
        filter={isCentral ? 'url(#glow)' : undefined}
        className="transition-all duration-200"
      />
      
      {/* Progress ring */}
      {node.progress > 0 && (
        <circle
          cx={node.x}
          cy={node.y}
          r={node.radius + 5}
          fill="none"
          stroke="#10b981"
          strokeWidth="2"
          strokeDasharray={`${2 * Math.PI * (node.radius + 5)}`}
          strokeDashoffset={`${2 * Math.PI * (node.radius + 5) * (1 - node.progress / 100)}`}
          transform={`rotate(-90 ${node.x} ${node.y})`}
          opacity="0.7"
        />
      )}
      
      {/* Node label */}
      <text
        x={node.x}
        y={node.y + 4}
        textAnchor="middle"
        className="text-xs font-medium fill-white pointer-events-none select-none"
        style={{ fontSize: isCentral ? '12px' : '10px', fontWeight: isCentral ? 'bold' : 'normal' }}
      >
        {node.label}
      </text>
    </g>
  );
};
