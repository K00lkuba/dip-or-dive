import { useState, useCallback, useRef, useEffect } from 'react';

interface ZoomPanState {
  scale: number;
  translateX: number;
  translateY: number;
}

interface UseZoomPanReturn {
  scale: number;
  translateX: number;
  translateY: number;
  handleWheel: (event: React.WheelEvent<SVGSVGElement>) => void;
  handleMouseDown: (event: React.MouseEvent<SVGSVGElement>) => void;
  handleMouseMove: (event: React.MouseEvent<SVGSVGElement>) => void;
  handleMouseUp: (event: React.MouseEvent<SVGSVGElement>) => void;
  resetView: () => void;
}

export const useZoomPan = (): UseZoomPanReturn => {
  const [state, setState] = useState<ZoomPanState>({
    scale: 1,
    translateX: 0,
    translateY: 0,
  });

  const isDragging = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  const handleWheel = useCallback((event: React.WheelEvent<SVGSVGElement>) => {
    event.preventDefault();
    event.stopPropagation();
    
    const rect = event.currentTarget.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    
    const scaleFactor = event.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.max(0.1, Math.min(3, state.scale * scaleFactor));
    
    // Zoom to cursor position
    const scaleChange = newScale / state.scale;
    const newTranslateX = mouseX - (mouseX - state.translateX) * scaleChange;
    const newTranslateY = mouseY - (mouseY - state.translateY) * scaleChange;
    
    setState({
      scale: newScale,
      translateX: newTranslateX,
      translateY: newTranslateY,
    });
  }, [state.scale, state.translateX, state.translateY]);

  const handleMouseDown = useCallback((event: React.MouseEvent<SVGSVGElement>) => {
    if (event.button === 0) { // Left click only
      event.preventDefault();
      isDragging.current = true;
      lastMousePos.current = { x: event.clientX, y: event.clientY };
      event.currentTarget.style.cursor = 'grabbing';
    }
  }, []);

  const handleMouseMove = useCallback((event: React.MouseEvent<SVGSVGElement>) => {
    if (isDragging.current) {
      const deltaX = event.clientX - lastMousePos.current.x;
      const deltaY = event.clientY - lastMousePos.current.y;
      
      setState(prev => ({
        ...prev,
        translateX: prev.translateX + deltaX,
        translateY: prev.translateY + deltaY,
      }));
      
      lastMousePos.current = { x: event.clientX, y: event.clientY };
    }
  }, []);

  const handleMouseUp = useCallback((event: React.MouseEvent<SVGSVGElement>) => {
    if (isDragging.current) {
      isDragging.current = false;
      event.currentTarget.style.cursor = 'grab';
    }
  }, []);

  const resetView = useCallback(() => {
    setState({
      scale: 1,
      translateX: 0,
      translateY: 0,
    });
  }, []);

  // Global mouse up listener to handle dragging outside the SVG
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging.current) {
        isDragging.current = false;
        document.body.style.cursor = 'default';
      }
    };

    document.addEventListener('mouseup', handleGlobalMouseUp);
    
    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, []);

  return {
    ...state,
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    resetView,
  };
};
