import { useEffect, useRef, useState } from 'react';

interface ParallaxOffset {
  x: number;
  y: number;
}

export function useParallax(intensity: number = 20) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState<ParallaxOffset>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const x = ((e.clientX - centerX) / rect.width) * intensity;
      const y = ((e.clientY - centerY) / rect.height) * intensity;
      setOffset({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [intensity]);

  return { ref, offset };
}
