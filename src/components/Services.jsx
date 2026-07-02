import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useSpring, useMotionValueEvent } from 'framer-motion';
import { db } from '../lib/db';

const TagCard = ({ number, title, text, className, aosDelay, aosType, pathLength, containerRef, style }) => {
  const ref = useRef(null);
  const [isActive, setIsActive] = useState(false);

  useMotionValueEvent(pathLength, "change", (latest) => {
    if (!ref.current || !containerRef.current) return;
    
    const cardRect = ref.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    
    const cardTopRelativeToContainer = cardRect.top - containerRect.top;
    const containerHeight = containerRect.height;
    
    const triggerY = cardTopRelativeToContainer + 50;
    const lineTipY = latest * containerHeight;
    
    if (lineTipY >= triggerY && !isActive) {
      setIsActive(true);
    } else if (lineTipY < triggerY && isActive) {
      setIsActive(false);
    }
  });

  return (
    <div 
      ref={ref}
      style={style}
      data-aos={aosType || "fade-up"} 
      data-aos-delay={aosDelay}
      className={`w-72 sm:w-80 rounded-[2rem] p-2 relative flex flex-col items-center hover:scale-[1.02] transition-all duration-700 z-10 ${className} ${
        isActive ? 'bg-[#ff2a2a] border-red-400 shadow-[0_20px_50px_rgba(255,42,42,0.4)]' : 'bg-white border border-zinc-200 shadow-[0_15px_40px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)]'
      }`}
    >
      <div className="w-5 h-5 bg-gradient-to-br from-zinc-300 to-zinc-100 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] absolute top-4 border border-zinc-300 z-10 flex items-center justify-center">
        <div className="w-2 h-2 bg-zinc-800 rounded-full opacity-20"></div>
      </div>
      
      <div className={`w-full h-full rounded-[1.5rem] mt-8 p-8 flex flex-col min-h-[220px] transition-colors duration-700 ${
        isActive ? 'bg-red-700/50' : 'bg-zinc-50'
      }`}>
        <span className={`text-xl font-bold mb-2 font-serif italic transition-colors duration-700 ${
          isActive ? 'text-red-200' : 'text-zinc-400'
        }`}>{number}</span>
        
        <h3 className={`text-2xl font-black mb-3 tracking-tight transition-colors duration-700 ${
          isActive ? 'text-white' : 'text-zinc-900'
        }`}>{title}</h3>
        
        <p className={`text-sm leading-relaxed font-medium transition-colors duration-700 ${
          isActive ? 'text-red-100' : 'text-zinc-500'
        }`}>
          {text}
        </p>
      </div>
    </div>
  );
};

const Services = () => {
  const containerRef = useRef(null);
  const [data, setData] = useState(db.getData());
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleUpdate = () => setData(db.getData());
    window.addEventListener("portfolio_db_updated", handleUpdate);
    
    const checkSize = () => setIsDesktop(window.innerWidth >= 768);
    checkSize();
    window.addEventListener("resize", checkSize);

    return () => {
      window.removeEventListener("portfolio_db_updated", handleUpdate);
      window.removeEventListener("resize", checkSize);
    };
  }, []);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const pathLength = useSpring(scrollYProgress, { stiffness: 60, damping: 20, restDelta: 0.001 });

  // Calculate dynamic container height based on services count
  const servicesCount = data.services.length;
  const containerHeight = isDesktop ? Math.max(700, servicesCount * 380 + 100) : 'auto';

  return (
    <section 
      id="services"
      ref={containerRef}
      className="bg-white pt-24 pb-32 px-6 md:px-12 w-full relative overflow-hidden font-sans bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:80px_80px]"
    >
      <div 
        className="max-w-6xl mx-auto relative"
        style={{ height: isDesktop ? `${containerHeight}px` : 'auto' }}
      >
        
        {/* Header Content */}
        <div data-aos="fade-up" className="md:absolute top-10 left-0 md:w-[450px] z-20 mb-16 md:mb-0">
          <div className="inline-block border border-zinc-300 rounded-full px-5 py-1.5 text-sm text-zinc-600 font-bold mb-8 shadow-sm bg-white">
            What We Offer
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-zinc-900 leading-[1.1] mb-6 tracking-tight relative">
            Driving your tech systems to new heights
            <svg className="absolute -bottom-10 right-10 w-12 h-12 text-zinc-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M4 4 Q 10 10 15 15 M 15 15 L 10 15 M 15 15 L 15 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </h2>
          <p className="text-zinc-500 text-base md:text-lg max-w-sm font-medium leading-relaxed">
            A structured, creative, and highly technical approach to deliver pixel-perfect, scalable web apps.
          </p>
        </div>

        {/* Desktop SVG Animated Dashed Line */}
        {isDesktop && (
          <svg 
            className="absolute top-0 left-0 w-full h-full pointer-events-none z-0" 
            viewBox={`0 0 1000 ${containerHeight}`} 
            preserveAspectRatio="none"
          >
            <path 
              d={`M 650,200 C 400,300 200,400 300,600 C 400,800 750,750 700,950 C 650,1150 400,1150 300,${containerHeight - 50}`} 
              fill="none" 
              stroke="#cbd5e1" 
              strokeWidth="2" 
              strokeDasharray="8 10" 
            />
            <mask id="path-mask">
              <motion.path 
                d={`M 650,200 C 400,300 200,400 300,600 C 400,800 750,750 700,950 C 650,1150 400,1150 300,${containerHeight - 50}`} 
                fill="none" 
                stroke="white" 
                strokeWidth="20" 
                style={{ pathLength }}
              />
            </mask>
            <path 
              d={`M 650,200 C 400,300 200,400 300,600 C 400,800 750,750 700,950 C 650,1150 400,1150 300,${containerHeight - 50}`} 
              fill="none" 
              stroke="black" 
              strokeWidth="2" 
              strokeDasharray="8 10" 
              mask="url(#path-mask)"
              className="drop-shadow-sm"
            />
          </svg>
        )}

        {/* Mobile Animated Vertical Dashed Line */}
        {!isDesktop && (
          <svg 
            className="absolute top-0 left-[50%] -translate-x-1/2 w-4 h-[100%] pointer-events-none z-0" 
            viewBox="0 0 4 100" 
            preserveAspectRatio="none"
          >
            <path 
              d="M 2,0 L 2,100" 
              fill="none" 
              stroke="#cbd5e1" 
              strokeWidth="4" 
              strokeDasharray="4 6" 
              vectorEffect="non-scaling-stroke"
            />
            <mask id="path-mask-mobile">
              <motion.path 
                d="M 2,0 L 2,100" 
                fill="none" 
                stroke="white" 
                strokeWidth="4" 
                style={{ pathLength }}
                vectorEffect="non-scaling-stroke"
              />
            </mask>
            <path 
              d="M 2,0 L 2,100" 
              fill="none" 
              stroke="black" 
              strokeWidth="4" 
              strokeDasharray="4 6" 
              mask="url(#path-mask-mobile)"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        )}

        {/* Cards Container */}
        <div className="flex flex-col gap-8 md:gap-12 items-center md:block relative z-10 w-full pt-4 md:pt-0 pb-12 md:pb-0">
          {data.services.map((srv, idx) => {
            // Alternate left and right alignments on desktop
            const isLeft = idx % 2 !== 0;
            const horizontalClass = isLeft 
              ? 'md:left-[5%] lg:left-[10%] -rotate-2 md:-rotate-4' 
              : 'md:right-[5%] lg:right-[10%] rotate-2 md:rotate-4';
            
            const cardTop = idx * 350 + 200;
            
            return (
              <TagCard 
                key={idx}
                number={`0${idx + 1}`}
                title={srv.title}
                text={srv.description}
                className={horizontalClass}
                style={{
                  position: isDesktop ? 'absolute' : 'relative',
                  top: isDesktop ? `${cardTop}px` : 'auto'
                }}
                aosType={isLeft ? 'fade-right' : 'fade-left'}
                aosDelay={(idx + 1) * 100}
                pathLength={pathLength}
                containerRef={containerRef}
              />
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Services;
