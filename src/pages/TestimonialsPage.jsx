import React, { useState, useEffect } from 'react';
import { db } from '../lib/db';
import SubPageHeader from '../components/SubPageHeader';

const TestimonialsPage = () => {
  const [data, setData] = useState(db.getData());

  useEffect(() => {
    const handleUpdate = () => setData(db.getData());
    window.addEventListener("portfolio_db_updated", handleUpdate);
    return () => window.removeEventListener("portfolio_db_updated", handleUpdate);
  }, []);

  return (
    <div className="bg-zinc-950 min-h-screen text-white font-sans pb-24">
      <SubPageHeader title="Testimonials" subtitle="What tech leads, directors, and colleagues say about working with me." />

      <div className="max-w-4xl mx-auto px-6 md:px-12 mt-16 space-y-8">
        {data.testimonials.map((test, idx) => (
          <div key={idx} className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4 relative">
            <span className="absolute top-6 right-8 text-7xl text-zinc-800 font-serif leading-none select-none pointer-events-none">“</span>
            <p className="text-base text-zinc-350 italic leading-relaxed relative z-10">
              "{test.text}"
            </p>
            <div className="border-t border-zinc-850 pt-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#ff2a2a]/20 border border-[#ff2a2a]/30 flex items-center justify-center font-bold text-xs text-[#ff2a2a] uppercase">
                {test.name.slice(0, 2)}
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{test.name}</h4>
                <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">{test.role} @ {test.company}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsPage;
