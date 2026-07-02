import React from 'react';

const GradientOrb = ({ 
  size = 400, 
  color1 = '#ff2a2a', 
  color2 = '#ff6b6b', 
  className = '',
  style = {}
}) => {
  return (
    <div
      className={`absolute pointer-events-none ${className}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color1}30 0%, ${color2}10 40%, transparent 70%)`,
        borderRadius: '50%',
        filter: 'blur(60px)',
        animation: 'orbPulse 8s ease-in-out infinite',
        willChange: 'transform, opacity',
        ...style,
      }}
    >
      <style>{`
        @keyframes orbPulse {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.6; }
          25% { transform: scale(1.1) rotate(5deg); opacity: 0.8; }
          50% { transform: scale(0.95) rotate(-3deg); opacity: 0.5; }
          75% { transform: scale(1.05) rotate(2deg); opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};

export default GradientOrb;
