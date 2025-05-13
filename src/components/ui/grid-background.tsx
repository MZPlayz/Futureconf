
'use client';

import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface GridBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  gridColor?: string;
  glowColor?: string;
  glowSize?: string;
  gridSize?: string; // Added for grid cell size customization
}

const GridBackground: React.FC<GridBackgroundProps> = ({
  children,
  className,
  gridColor = 'hsl(var(--border) / 0.2)', // Further increased alpha for more visibility
  glowColor = 'hsl(var(--primary) / 0.1)', 
  glowSize = '500px',
  gridSize = '30px', 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        containerRef.current.style.setProperty('--mouse-x', `${x}px`);
        containerRef.current.style.setProperty('--mouse-y', `${y}px`);
      }
    };

    // Only add event listener if not on a touch device (optional enhancement)
    const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
    let currentRefValue = containerRef.current;

    if (!isTouchDevice && currentRefValue) {
      currentRefValue.addEventListener('mousemove', handleMouseMove);
    } else if (currentRefValue) { // Set a default glow position if no mouse
        const rect = currentRefValue.getBoundingClientRect();
        currentRefValue.style.setProperty('--mouse-x', `${rect.width / 2}px`);
        currentRefValue.style.setProperty('--mouse-y', `${rect.height / 4}px`); // Slightly top-centered
    }


    return () => {
      if (!isTouchDevice && currentRefValue) {
        currentRefValue.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []); 

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative w-full h-full overflow-hidden bg-background isolate', 
        className
      )}
      style={
        {
          '--grid-color': gridColor,
          '--glow-color': glowColor,
          '--glow-size': glowSize,
          '--grid-cell-size': gridSize,
          '--mouse-x': '50%', 
          '--mouse-y': '50%',
        } as React.CSSProperties
      }
    >
      {/* Grid Pattern */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--grid-color) 1px, transparent 1px),
            linear-gradient(to bottom, var(--grid-color) 1px, transparent 1px)
          `,
          backgroundSize: `var(--grid-cell-size) var(--grid-cell-size)`,
        }}
      />
      {/* Mouse Follow Glow */}
      <div
        className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100" 
        style={{
          background: `
            radial-gradient(
              circle var(--glow-size) at var(--mouse-x) var(--mouse-y),
              var(--glow-color),
              transparent 80% 
            )
          `,
        }}
      />
      <div className="relative z-10 h-full"> 
        {children}
      </div>
    </div>
  );
};

export default GridBackground;

