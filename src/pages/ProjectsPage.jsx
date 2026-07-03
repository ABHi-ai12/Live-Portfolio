import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../lib/db';
import SubPageHeader from '../components/SubPageHeader';
import { ArrowUpRight, ExternalLink, Sparkles } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

import MagneticButton from '../components/effects/MagneticButton';
import MouseGlow from '../components/effects/MouseGlow';
import GradientOrb from '../components/effects/GradientOrb';

const ProjectsPage = () => {
  const [data, setData] = useState(db.getData());
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out',
    });

    const handleUpdate = () => setData(db.getData());
    window.addEventListener('portfolio_db_updated', handleUpdate);
    return () => window.removeEventListener('portfolio_db_updated', handleUpdate);
  }, []);

  // Filter categories dynamically based on project tags
  const filters = ['All', 'Full Stack', 'Frontend', 'Backend', 'AI & Data'];

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'All') return data.projects;
    
    return data.projects.filter(project => {
      const matchText = activeFilter.toLowerCase();
      // Match by tech tags or explicit category mapping
      if (matchText === 'full stack') {
        return project.tech.some(t => t.toLowerCase().includes('next') || t.toLowerCase().includes('node') || t.toLowerCase().includes('express') || t.toLowerCase().includes('mongo') || t.toLowerCase().includes('sql') || t.toLowerCase().includes('auth'));
      }
      if (matchText === 'frontend') {
        return project.tech.some(t => t.toLowerCase().includes('react') || t.toLowerCase().includes('tailwind') || t.toLowerCase().includes('framer') || t.toLowerCase().includes('css') || t.toLowerCase().includes('js'));
      }
      if (matchText === 'backend') {
        return project.tech.some(t => t.toLowerCase().includes('node') || t.toLowerCase().includes('docker') || t.toLowerCase().includes('redis') || t.toLowerCase().includes('rabbitmq') || t.toLowerCase().includes('python'));
      }
      if (matchText === 'ai & data') {
        return project.tech.some(t => t.toLowerCase().includes('gemini') || t.toLowerCase().includes('ai') || t.toLowerCase().includes('openai') || t.toLowerCase().includes('ml'));
      }
      return true;
    });
  }, [data.projects, activeFilter]);

  return (
    <div className="bg-black min-h-screen text-white font-sans relative overflow-hidden">
      {/* 1. Subpage Header */}
      <SubPageHeader
        title="Projects"
        subtitle="Selected full-stack systems, SaaS launchers, and high-performance interfaces."
      />

      {/* 2. Interactive Showcase Section */}
      <section className="bg-zinc-955 py-20 px-6 md:px-12 w-full relative overflow-hidden border-b border-zinc-900">
        <MouseGlow color="rgba(255, 42, 42, 0.05)" size={600} />
        
        <div className="max-w-6xl mx-auto space-y-12 relative z-10">
          
          {/* Filter Navigation */}
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 bg-zinc-900/40 p-2 rounded-2xl border border-zinc-800/80 backdrop-blur-md max-w-2xl mx-auto">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  activeFilter === filter
                    ? 'bg-[var(--theme-color)] text-white shadow-[0_0_15px_rgba(255,42,42,0.25)]'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/40'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <GradientOrb size={600} className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-25" />

          {/* Projects Grid with AnimatePresence */}
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, idx) => (
                <ProjectCard 
                  key={project.title}
                  project={project}
                  index={idx}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <div className="text-center py-20 bg-zinc-900/20 border border-zinc-800/80 rounded-3xl backdrop-blur-md">
              <Sparkles className="w-10 h-10 text-zinc-600 mx-auto mb-4" />
              <p className="text-zinc-400 text-sm font-medium">No projects found in this category.</p>
            </div>
          )}

        </div>
      </section>

      {/* 3. Bottom Stats Banner */}
      <section className="bg-black py-20 px-6 md:px-12 w-full border-b border-zinc-900">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-1.5 p-6 rounded-2xl bg-zinc-950 border border-zinc-900">
            <span className="block text-2xl font-mono font-black text-[var(--theme-color)]">100%</span>
            <p className="text-xs uppercase tracking-wider text-zinc-400 font-bold">// Git Test Coverage</p>
          </div>
          <div className="space-y-1.5 p-6 rounded-2xl bg-zinc-950 border border-zinc-900">
            <span className="block text-2xl font-mono font-black text-[var(--theme-color)]">MODULAR</span>
            <p className="text-xs uppercase tracking-wider text-zinc-400 font-bold">// Architecture Design</p>
          </div>
          <div className="space-y-1.5 p-6 rounded-2xl bg-zinc-950 border border-zinc-900">
            <span className="block text-2xl font-mono font-black text-[var(--theme-color)]">SECURE</span>
            <p className="text-xs uppercase tracking-wider text-zinc-400 font-bold">// Standard Compliance</p>
          </div>
        </div>
      </section>
    </div>
  );
};

/* ─── Tilt-enabled Project Card ───────────────────────────── */
const ProjectCard = ({ project, index }) => {
  const [tiltStyle, setTiltStyle] = useState({
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
    transition: 'transform 0.4s ease-out',
  });

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateY = ((x - centerX) / centerX) * 8; // Max 8 degrees Y
    const rotateX = ((centerY - y) / centerY) * 8; // Max 8 degrees X

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      transition: 'transform 0.1s ease-out',
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
      transition: 'transform 0.5s ease-out',
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 30 }}
      transition={{ duration: 0.4 }}
      style={tiltStyle}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="p-6 md:p-8 rounded-[2rem] bg-zinc-900/30 backdrop-blur-xl border border-zinc-800/80 shadow-2xl relative overflow-hidden group hover:border-zinc-700 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(255,42,42,0.04)] flex flex-col justify-between min-h-[300px]"
    >
      {/* Top glowing bar */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--theme-color)]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="space-y-5">
        <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
          <span className="text-xs font-mono text-[var(--theme-color)] font-bold tracking-widest">// 0{index + 1}</span>
          <div className="flex gap-2">
            {project.link && (
              <MagneticButton strength={0.25}>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                  </svg>
                </a>
              </MagneticButton>
            )}
            <MagneticButton strength={0.25}>
              <a
                href={project.link || "#"}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-[var(--theme-color)] hover:border-zinc-700 transition-colors cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </MagneticButton>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-black text-white group-hover:text-[var(--theme-color)] transition-colors leading-tight">
            {project.title}
          </h3>
          <p className="text-zinc-400 text-sm leading-relaxed font-medium">
            {project.description}
          </p>
        </div>
      </div>

      {/* Tech tags */}
      <div className="flex flex-wrap gap-1.5 mt-6 pt-4 border-t border-zinc-800/80">
        {project.tech?.map((techItem, idx) => (
          <span
            key={idx}
            className="px-2.5 py-0.5 rounded-md text-[9px] font-mono font-bold tracking-wider uppercase bg-zinc-950/80 text-zinc-400 border border-zinc-850"
          >
            {techItem}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

export default ProjectsPage;
