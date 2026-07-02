import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { db } from '../lib/db';
import SubPageHeader from '../components/SubPageHeader';
import { Cpu, Terminal, Database, Cloud, Layers, Languages, Sparkles } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

import MouseGlow from '../components/effects/MouseGlow';
import GradientOrb from '../components/effects/GradientOrb';

const SkillsPage = () => {
  const [data, setData] = useState(db.getData());
  const sectionRef = useRef(null);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out'
    });

    const handleUpdate = () => setData(db.getData());
    window.addEventListener("portfolio_db_updated", handleUpdate);
    return () => window.removeEventListener("portfolio_db_updated", handleUpdate);
  }, []);

  const getLevelPercentage = (level) => {
    const l = level?.toLowerCase();
    if (l === 'expert') return '90%';
    if (l === 'advanced') return '75%';
    if (l === 'intermediate') return '60%';
    return '50%';
  };

  const getCategoryIcon = (category) => {
    const c = category?.toLowerCase();
    if (c.includes('front')) return <Layers className="w-5 h-5 text-[#ff2a2a]" />;
    if (c.includes('back')) return <Terminal className="w-5 h-5 text-[#ff2a2a]" />;
    if (c.includes('data')) return <Database className="w-5 h-5 text-[#ff2a2a]" />;
    if (c.includes('devops') || c.includes('cloud')) return <Cloud className="w-5 h-5 text-[#ff2a2a]" />;
    if (c.includes('language')) return <Languages className="w-5 h-5 text-[#ff2a2a]" />;
    return <Cpu className="w-5 h-5 text-[#ff2a2a]" />;
  };

  // Group skills by category
  const categories = data.skills.reduce((acc, skill) => {
    const cat = skill.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  return (
    <div className="bg-black min-h-screen text-white font-sans relative overflow-hidden">
      {/* 1. Subpage Header */}
      <SubPageHeader title="Skills" subtitle="My core capabilities, frameworks, database systems, and cloud arsenal." />

      {/* 2. Content Section */}
      <section 
        ref={sectionRef} 
        className="bg-zinc-955 w-full py-24 px-6 md:px-12 border-b border-zinc-900 relative overflow-hidden"
      >
        <MouseGlow color="rgba(255, 42, 42, 0.05)" size={500} />
        <GradientOrb size={600} className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20" />

        <div className="max-w-6xl mx-auto space-y-16 relative z-10">
          {/* Section label */}
          <div data-aos="fade-up" className="space-y-3">
            <div className="inline-block border border-zinc-800 rounded-full px-5 py-1.5 text-sm text-zinc-400 font-bold shadow-sm bg-black/40 backdrop-blur-sm uppercase tracking-wider font-mono">
              // Technical Arsenal
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight uppercase">
              Frameworks, languages, & tools I ship with.
            </h2>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(categories).map(([category, list], catIdx) => (
              <SkillCard
                key={category}
                category={category}
                list={list}
                catIdx={catIdx}
                getCategoryIcon={getCategoryIcon}
                getLevelPercentage={getLevelPercentage}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 3. Stats / Certs Highlight */}
      <section className="bg-black py-20 px-6 md:px-12 w-full border-b border-zinc-900">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="space-y-3">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#ff2a2a] font-bold">
              // Certifications & Standards
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
              Validated Technical Expertise
            </h2>
            <p className="text-zinc-400 text-sm max-w-xl">
              Equipped with certifications that validate standard-compliant cloud architectures, secure development lifecycles, and industry best practices.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="px-6 py-4 bg-zinc-950 border border-zinc-900 rounded-2xl flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-[#ff2a2a]" />
              <span className="text-sm font-semibold uppercase tracking-wider">AWS Solutions Architect</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

/* ─── Skill Category Card ───────────────────────────── */
const SkillCard = ({ category, list, catIdx, getCategoryIcon, getLevelPercentage }) => {
  const [tiltStyle, setTiltStyle] = useState({
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
    transition: 'transform 0.4s ease-out',
  });

  const handleMouseMove = useCallback((e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateY = ((x - centerX) / centerX) * 6; // Max 6 deg
    const rotateX = ((centerY - y) / centerY) * 6;

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      transition: 'transform 0.1s ease-out',
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
      transition: 'transform 0.5s ease-out',
    });
  }, []);

  return (
    <div 
      data-aos="fade-up"
      data-aos-delay={catIdx * 100}
      className="p-8 rounded-[2rem] bg-zinc-900/30 backdrop-blur-xl border border-zinc-800/80 shadow-2xl relative overflow-hidden group hover:border-zinc-700 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(255,42,42,0.03)]"
      style={tiltStyle}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Top hover glow */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#ff2a2a]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="flex items-center gap-3 border-b border-zinc-800/80 pb-4 mb-6">
        {getCategoryIcon(category)}
        <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-[#ff2a2a] font-bold">
          // {category}
        </h3>
      </div>

      <div className="space-y-6">
        {list.map((skill, idx) => (
          <div key={idx} className="space-y-2 group/skill">
            <div className="flex justify-between items-center text-sm font-semibold">
              <span className="text-zinc-200 group-hover/skill:text-white transition-colors">
                {skill.name}
              </span>
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                {skill.level}
              </span>
            </div>

            {/* Modern progress track with pulse point */}
            <div className="h-1 w-full bg-zinc-950 rounded-full overflow-hidden border border-zinc-900 relative">
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: getLevelPercentage(skill.level) }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: "easeOut", delay: idx * 0.08 }}
                className="h-full bg-gradient-to-r from-[#ff2a2a]/70 to-[#ff2a2a] rounded-full relative"
              >
                {/* Glow point */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-1 bg-white rounded-full shadow-[0_0_8px_#ffffff]" />
              </motion.div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsPage;
