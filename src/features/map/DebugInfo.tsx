import React from 'react';

interface DebugInfoProps {
  scale: number;
  translateX: number;
  translateY: number;
  nodeCount: number;
  connectionCount: number;
}

export const DebugInfo: React.FC<DebugInfoProps> = ({
  scale,
  translateX,
  translateY,
  nodeCount,
  connectionCount,
}) => {
  // Only show in development
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    return null;
  }

  return (
    <div className="absolute top-4 right-4 bg-black bg-opacity-75 text-white text-xs p-2 rounded font-mono">
      <div>Scale: {scale.toFixed(2)}</div>
      <div>X: {translateX.toFixed(0)}</div>
      <div>Y: {translateY.toFixed(0)}</div>
      <div>Nodes: {nodeCount}</div>
      <div>Connections: {connectionCount}</div>
      <div className="text-yellow-400">v5.3</div>
    </div>
  );
};
