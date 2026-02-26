'use client';

import { useEffect, useRef, useState } from 'react';

export function StarfieldBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [stars, setStars] = useState<Array<{ x: number; y: number; size: number; opacity: number; color: string }>>([]);

  useEffect(() => {
    // Generate stars on mount
    const starCount = 200;
    const newStars = Array.from({ length: starCount }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.3,
      color: Math.random() > 0.7 ? '#38bdf8' : Math.random() > 0.4 ? '#a855f7' : '#ffffff',
    }));
    setStars(newStars);
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at center, rgba(15, 23, 42, 0.9) 0%, rgba(2, 6, 23, 1) 100%)',
      }}
    >
      {/* Animated stars */}
      {stars.map((star, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-twinkle"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: star.color,
            opacity: star.opacity,
            boxShadow: `0 0 ${star.size * 2}px ${star.color}`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 2}s`,
          }}
        />
      ))}

      {/* Gradient overlays */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
    </div>
  );
}
