import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../lib/db';

const Footer = () => {
  const [data, setData] = useState(db.getData());

  useEffect(() => {
    const handleUpdate = () => setData(db.getData());
    window.addEventListener("portfolio_db_updated", handleUpdate);
    return () => window.removeEventListener("portfolio_db_updated", handleUpdate);
  }, []);

  return (
    <footer className="bg-[#111111] text-[#d4d4d4] py-16 px-6 md:px-12 w-full font-mono text-[10px] md:text-xs tracking-widest flex flex-col justify-between min-h-[50vh]">
      
      {/* Top Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 w-full font-medium">
        <div className="flex flex-col gap-1">
          <p>Full Stack Software Architect</p>
          <p>React, Node.js, Cloud Architectures</p>
          <p>Premium Interactive Portfolios</p>
        </div>
        
        <div className="flex flex-col gap-1 md:items-center">
          <p>5+ years of experience</p>
          <Link to="/projects" className="underline hover:text-white transition-colors mt-1 underline-offset-4 decoration-1">View Projects</Link>
        </div>
        
        <div className="flex flex-col gap-1 md:items-end">
          <p>Worldwide Available</p>
          <p>{new Date().getFullYear()}</p>
        </div>
      </div>

      {/* Middle Huge Text */}
      <div className="w-full flex justify-center items-center py-20 md:py-24 overflow-hidden">
        <h2 className="text-[18vw] md:text-[16vw] leading-none font-sans font-bold tracking-tighter lowercase select-none text-[#f4f4f4] w-full text-center">
          {data.personal.name}
        </h2>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 w-full items-end font-medium">
        <div className="flex flex-col gap-6">
          <Link to="/contact" className="underline hover:text-white transition-colors underline-offset-4 decoration-1 font-bold">Contact</Link>
          <p className="text-white/60 font-mono text-[9px] md:text-[10px]">
            &copy; {new Date().getFullYear()} {data.personal.name} Studio | Built with React
          </p>
        </div>
        
        <div className="flex flex-col gap-1 md:items-center">
          <a href={`mailto:${data.personal.email}`} className="underline hover:text-white transition-colors underline-offset-4 decoration-1 lowercase">{data.personal.email}</a>
        </div>
        
        <div className="flex flex-col gap-1 md:items-end">
          <Link to="/privacy-policy" className="underline hover:text-white transition-colors underline-offset-4 decoration-1">Privacy Policy</Link>
          <Link to="/terms" className="underline hover:text-white transition-colors mt-1.5 underline-offset-4 decoration-1">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
