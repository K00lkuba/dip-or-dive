import React from 'react';
import { ConceptNode } from './types';

interface ConceptConnectionRendererProps {
  fromNode: ConceptNode;
  toNode: ConceptNode;
  isHighlighted?: boolean;
}

export const ConceptConnectionRenderer: React.FC<ConceptConnectionRendererProps> = ({
  fromNode,
  toNode,
  isHighlighted = false,
}) => {
  const dx = toNode.x - fromNode.x;
  const dy = toNode.y - fromNode.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Calculate connection points on the edge of the circles
  const fromRadius = fromNode.radius + 2;
  const toRadius = toNode.radius + 2;
  
  const fromX = fromNode.x + (dx / distance) * fromRadius;
  const fromY = fromNode.y + (dy / distance) * fromRadius;
  const toX = toNode.x - (dx / distance) * toRadius;
  const toY = toNode.y - (dy / distance) * toRadius;

  return (
    <line
      x1={fromX}
      y1={fromY}
      x2={toX}
      y2={toY}
      stroke={isHighlighted ? '#3b82f6' : '#6b7280'}
      strokeWidth={isHighlighted ? 3 : 1}
      opacity={isHighlighted ? 1 : 0.5}
      className="transition-all duration-200"
    />
  );
};
