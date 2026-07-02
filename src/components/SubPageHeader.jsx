import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const SubPageHeader = ({ title, subtitle }) => {
  return (
    <div className="relative bg-[#070708] pt-32 pb-20 px-6 md:px-12 overflow-hidden border-b border-zinc-900/80">
      {/* Premium background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      
      {/* Floating radial gradient glow orb */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#ff2a2a]/10 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDuration: '6s' }} />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-zinc-900/50 rounded-full blur-[80px] pointer-events-none" />

      {/* Huge Background Watermark with entrance animation */}
      <div className="absolute inset-0 flex justify-center items-center overflow-hidden pointer-events-none z-0">
        <motion.h1 
          initial={{ opacity: 0, scale: 0.85, y: 30 }}
          animate={{ opacity: 0.03, scale: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="text-[18vw] leading-none font-black text-white uppercase select-none tracking-tighter scale-y-[1.3] origin-center"
          style={{ fontFamily: "'Impact', 'Arial Black', sans-serif" }}
        >
          {title}
        </motion.h1>
      </div>

      {/* Foreground Content */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.1 }
          }
        }}
        className="max-w-6xl mx-auto relative z-10 space-y-5"
      >
        {/* Breadcrumb */}
        <motion.div 
          variants={{
            hidden: { opacity: 0, y: -10 },
            visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
          }}
          className="flex items-center gap-2 text-xs font-mono tracking-[0.2em] text-zinc-500 uppercase"
        >
          <Link to="/" className="hover:text-[#ff2a2a] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[#ff2a2a] font-bold">{title}</span>
        </motion.div>

        {/* Title */}
        <motion.h1 
          variants={{
            hidden: { opacity: 0, x: -30 },
            visible: { opacity: 1, x: 0, transition: { type: "spring", damping: 15 } }
          }}
          className="text-4xl md:text-7xl font-black text-white uppercase tracking-tight flex items-center gap-4"
        >
          <span className="text-[#ff2a2a] font-light">//</span> {title}
        </motion.h1>

        {/* Subtitle */}
        {subtitle && (
          <motion.p 
            variants={{
              hidden: { opacity: 0, y: 15 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
            }}
            className="text-sm md:text-lg text-zinc-400 max-w-2xl font-medium leading-relaxed"
          >
            {subtitle}
          </motion.p>
        )}
      </motion.div>

      {/* Bottom glowing accent line */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ff2a2a]/30 to-transparent" />
    </div>
  );
};

export default SubPageHeader;
