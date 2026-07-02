import React, { useEffect, useRef } from 'react';

const MouseGlow = ({ color = 'rgba(255, 42, 42, 0.15)', size = 400 }) => {
  const glowRef = useRef(null);
  const mouse = useRef({ x: -1000, y: -1000 });
  const current = useRef({ x: -1000, y: -1000 });
  const raf = useRef(null);

  useEffect(() => {
    const handleMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    const animate = () => {
      current.current.x += (mouse.current.x - current.current.x) * 0.08;
      current.current.y += (mouse.current.y - current.current.y) * 0.08;

      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${current.current.x - size / 2}px, ${current.current.y - size / 2}px)`;
      }
      raf.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMove);
    raf.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [size]);

  return (
    <div
      ref={glowRef}
      className="fixed top-0 left-0 pointer-events-none z-50 mix-blend-screen"
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        willChange: 'transform',
      }}
    />
  );
};

export default MouseGlow;
