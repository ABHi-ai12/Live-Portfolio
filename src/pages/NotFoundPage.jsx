import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <main className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-6 relative overflow-hidden text-white font-sans">
      {/* Massive 404 background title */}
      <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center overflow-hidden pointer-events-none z-0">
        <h1 
          className="text-[30vw] leading-none font-black text-white/5 uppercase select-none tracking-tighter scale-y-[1.6]"
          style={{ fontFamily: "'Impact', 'Arial Black', sans-serif" }}
        >
          404
        </h1>
      </div>

      <div className="relative z-10 text-center space-y-6 max-w-sm bg-zinc-900 border border-zinc-800 p-8 rounded-3xl shadow-2xl">
        <h2 className="text-3xl font-black">Page Not Found</h2>
        <p className="text-xs text-zinc-400 leading-relaxed">
          The requested page is missing or has been relocated outside this domain hierarchy.
        </p>
        <Link 
          to="/"
          className="w-full flex items-center justify-center py-3 rounded-full bg-[#ff2a2a] text-white font-bold hover:bg-white hover:text-[#ff2a2a] transition-all text-xs cursor-pointer"
        >
          Return to Home
        </Link>
      </div>
    </main>
  );
};

export default NotFoundPage;
