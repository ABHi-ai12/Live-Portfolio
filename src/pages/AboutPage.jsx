import React, { useState, useEffect, useRef, useCallback } from 'react';
import { db } from '../lib/db';
import SubPageHeader from '../components/SubPageHeader';
import stackImage from '../assets/about/image.png';
import reactImage from '../assets/about/react.png';
import nodeImage from '../assets/about/node.png';
import mongoImage from '../assets/about/mongodb.png';
import { motion } from 'framer-motion';
import { MapPin, Mail, Sparkles, Code, Cpu, Shield, Zap } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

import MouseGlow from '../components/effects/MouseGlow';
import SplitTextReveal from '../components/effects/SplitTextReveal';
import AnimatedCounter from '../components/effects/AnimatedCounter';
import MagneticButton from '../components/effects/MagneticButton';
import GradientOrb from '../components/effects/GradientOrb';

const AboutPage = () => {
  const [data, setData] = useState(db.getData());
  const badgeRef = useRef(null);
  const [badgeTilt, setBadgeTilt] = useState({ rotateX: 0, rotateY: 0 });

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

  const handleBadgeMouseMove = useCallback((e) => {
    const card = badgeRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    const rotateY = (mouseX / (rect.width / 2)) * 12;
    const rotateX = -(mouseY / (rect.height / 2)) * 12;
    setBadgeTilt({ rotateX, rotateY });
  }, []);

  const handleBadgeMouseLeave = useCallback(() => {
    setBadgeTilt({ rotateX: 0, rotateY: 0 });
  }, []);

  const coreValues = [
    {
      icon: <Zap className="w-6 h-6 text-[var(--theme-color)]" />,
      title: "Performance First",
      desc: "Optimized architectures, fast load times, and lightweight bundles for premium user experience."
    },
    {
      icon: <Cpu className="w-6 h-6 text-[var(--theme-color)]" />,
      title: "Scalable Systems",
      desc: "Modular codebase patterns, microservices architecture, and clean design patterns ready for growth."
    },
    {
      icon: <Shield className="w-6 h-6 text-[var(--theme-color)]" />,
      title: "Secure & Reliable",
      desc: "Adhering to strict security practices, route guards, robust session logic, and secure databases."
    }
  ];

  return (
    <div className="bg-black min-h-screen text-white font-sans pb-0 relative overflow-hidden">
      {/* Shimmer keyframes for capabilities ticker */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .shimmer-text {
          background: linear-gradient(90deg, currentColor 40%, #fff 50%, currentColor 60%);
          background-size: 200% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }
      `}</style>

      {/* 1. Subpage header */}
      <SubPageHeader title="About" subtitle="My professional profile, background narrative, and core focus." />

      {/* 2. Cohesive Narrative Section */}
      <section className="bg-zinc-950 py-24 px-6 md:px-12 w-full relative overflow-hidden border-b border-zinc-900">
        <MouseGlow color="rgba(255, 42, 42, 0.05)" size={500} />
        
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16 items-center relative z-20">
          {/* Left Side: ID Badge / Profile Image Card */}
          <div className="flex flex-col items-center w-full lg:w-[380px] shrink-0 relative">
            <motion.div 
              ref={badgeRef}
              onMouseMove={handleBadgeMouseMove}
              onMouseLeave={handleBadgeMouseLeave}
              style={{
                perspective: '1000px',
                transform: `perspective(1000px) rotateX(${badgeTilt.rotateX}deg) rotateY(${badgeTilt.rotateY}deg)`,
                transformStyle: 'preserve-3d',
                transition: badgeTilt.rotateX === 0 && badgeTilt.rotateY === 0
                  ? 'transform 0.5s ease-out'
                  : 'transform 0.1s ease-out',
              }}
              className="bg-zinc-900/60 backdrop-blur-md w-full max-w-[320px] rounded-3xl p-5 shadow-[0_30px_60px_rgba(0,0,0,0.6)] relative z-20 border border-zinc-800/80 group cursor-pointer hover:border-zinc-700/80 transition-all duration-300"
            >
              {/* Image Container with holographic overlay */}
              <div className="w-full aspect-[4/5] overflow-hidden rounded-2xl bg-zinc-950 border border-zinc-800 relative">
                <img 
                  src={(!data.personal.avatar || data.personal.avatar.startsWith('/src/')) ? stackImage : data.personal.avatar} 
                  alt={data.personal.name} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                />
                {/* Holographic screen lines */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
              </div>

              <div className="mt-6 text-center space-y-1">
                <h3 className="font-heading font-black text-md tracking-wider uppercase text-white group-hover:text-[var(--theme-color)] transition-colors">{data.personal.name}</h3>
                <p className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase">{data.personal.headline}</p>
              </div>
            </motion.div>
          </div>

          {/* Right Side: Biography and stats */}
          <div data-aos="fade-left" data-aos-delay="200" className="flex-1 space-y-8 relative">
            <GradientOrb size={500} color1="#000000" color2="#330000" className="-top-20 -right-20 opacity-30" />

            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--theme-color)] font-bold">
                // Developer Persona
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
                Hi, I'm <span className="text-transparent [-webkit-text-stroke:1.5px_white]">{data.personal.name}</span>
              </h2>
            </div>
            
            <p className="text-zinc-300 text-base md:text-lg leading-relaxed max-w-3xl font-medium">
              {data.personal.about}
            </p>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-3 gap-4 max-w-md pt-4">
              <div className="bg-zinc-900/40 border border-zinc-800/80 p-5 rounded-2xl text-center space-y-1 backdrop-blur-md">
                <AnimatedCounter target={5} suffix="+" className="block text-2xl md:text-3xl font-black text-[var(--theme-color)]" />
                <span className="block text-[9px] font-mono tracking-wider text-zinc-400 uppercase">Years Exp.</span>
              </div>
              <div className="bg-zinc-900/40 border border-zinc-800/80 p-5 rounded-2xl text-center space-y-1 backdrop-blur-md">
                <AnimatedCounter target={15} suffix="+" className="block text-2xl md:text-3xl font-black text-[var(--theme-color)]" />
                <span className="block text-[9px] font-mono tracking-wider text-zinc-400 uppercase">Projects</span>
              </div>
              <div className="bg-zinc-900/40 border border-zinc-800/80 p-5 rounded-2xl text-center space-y-1 backdrop-blur-md">
                <AnimatedCounter target={100} suffix="%" className="block text-2xl md:text-3xl font-black text-[var(--theme-color)]" />
                <span className="block text-[9px] font-mono tracking-wider text-zinc-400 uppercase">Success</span>
              </div>
            </div>

            {/* Location & Contact Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl pt-2">
              <MagneticButton strength={0.1}>
                <div className="p-5 rounded-2xl bg-zinc-900/30 border border-zinc-800/60 flex items-center gap-4 backdrop-blur-md">
                  <div className="w-10 h-10 rounded-xl bg-zinc-950 flex items-center justify-center text-white shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-zinc-500 tracking-widest uppercase font-bold">// Location</span>
                    <p className="text-sm font-bold text-white">{data.personal.location}</p>
                  </div>
                </div>
              </MagneticButton>

              <MagneticButton strength={0.1}>
                <div className="p-5 rounded-2xl bg-zinc-900/30 border border-zinc-800/60 flex items-center gap-4 backdrop-blur-md">
                  <div className="w-10 h-10 rounded-xl bg-zinc-950 flex items-center justify-center text-white shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9px] font-mono text-zinc-500 tracking-widest uppercase font-bold">// Email</span>
                    <a href={`mailto:${data.personal.email}`} className="text-sm font-bold text-white hover:text-[var(--theme-color)] transition-colors block truncate">{data.personal.email}</a>
                  </div>
                </div>
              </MagneticButton>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core Values & Principles Section */}
      <section className="bg-black py-24 px-6 md:px-12 w-full relative overflow-hidden border-b border-zinc-900">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--theme-color)] font-bold">
              // Coding Ideals
            </span>
            <h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight">
              Values Driving My Digital Crafts
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coreValues.map((val, idx) => (
              <div 
                key={idx} 
                data-aos="fade-up" 
                data-aos-delay={idx * 100}
                className="p-8 rounded-3xl bg-zinc-900/30 border border-zinc-800/80 space-y-4 hover:border-zinc-700 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-zinc-950 flex items-center justify-center">
                  {val.icon}
                </div>
                <h3 className="text-lg font-black text-white uppercase tracking-tight">{val.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Capabilities Scrolling Banner */}
      <section className="bg-zinc-950 py-16 w-full overflow-hidden border-b border-zinc-900">
        <div className="max-w-6xl mx-auto px-6 md:px-12 mb-4 flex items-center gap-2">
          <Sparkles className="text-[var(--theme-color)] w-4 h-4" />
          <h4 className="text-[10px] font-mono tracking-[0.25em] uppercase text-zinc-400 font-bold">
            Core Capabilities & Tech
          </h4>
        </div>

        <div className="flex gap-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]">
          <motion.div 
            animate={{ x: ["0%", "-50%"] }}
            transition={{ 
              ease: "linear", 
              duration: 25, 
              repeat: Infinity 
            }}
            className="flex gap-16 shrink-0 items-center pr-16"
          >
            {/* Set 1 */}
            <img src={reactImage} alt="React" className="h-10 w-auto object-contain grayscale opacity-30 hover:opacity-100 hover:grayscale-0 transition-all duration-300" />
            <img src={nodeImage} alt="Node.js" className="h-10 w-auto object-contain grayscale opacity-30 hover:opacity-100 hover:grayscale-0 transition-all duration-300" />
            <img src={mongoImage} alt="MongoDB" className="h-10 w-auto object-contain grayscale opacity-30 hover:opacity-100 hover:grayscale-0 transition-all duration-300" />
            <span className="text-lg font-black font-mono tracking-tighter uppercase shimmer-text">// Frontend Architecture</span>
            <span className="text-lg font-black font-mono tracking-tighter uppercase shimmer-text">// Backend Microservices</span>
            <span className="text-lg font-black font-mono tracking-tighter uppercase shimmer-text">// Interactive UI</span>
            
            {/* Duplicate for infinite loop */}
            <img src={reactImage} alt="React" className="h-10 w-auto object-contain grayscale opacity-30 hover:opacity-100 hover:grayscale-0 transition-all duration-300" />
            <img src={nodeImage} alt="Node.js" className="h-10 w-auto object-contain grayscale opacity-30 hover:opacity-100 hover:grayscale-0 transition-all duration-300" />
            <img src={mongoImage} alt="MongoDB" className="h-10 w-auto object-contain grayscale opacity-30 hover:opacity-100 hover:grayscale-0 transition-all duration-300" />
            <span className="text-lg font-black font-mono tracking-tighter uppercase shimmer-text">// Frontend Architecture</span>
            <span className="text-lg font-black font-mono tracking-tighter uppercase shimmer-text">// Backend Microservices</span>
            <span className="text-lg font-black font-mono tracking-tighter uppercase shimmer-text">// Interactive UI</span>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
