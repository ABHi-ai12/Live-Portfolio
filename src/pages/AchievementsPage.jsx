import React, { useState, useEffect } from 'react';
import { db } from '../lib/db';
import SubPageHeader from '../components/SubPageHeader';
import { Award } from 'lucide-react';

const AchievementsPage = () => {
  const [data, setData] = useState(db.getData());

  useEffect(() => {
    const handleUpdate = () => setData(db.getData());
    window.addEventListener("portfolio_db_updated", handleUpdate);
    return () => window.removeEventListener("portfolio_db_updated", handleUpdate);
  }, []);

  return (
    <div className="bg-zinc-950 min-h-screen text-white font-sans pb-24">
      <SubPageHeader title="Achievements" subtitle="Industry awards, hackathon highlights, and technical accomplishments." />

      <div className="max-w-4xl mx-auto px-6 md:px-12 mt-16 space-y-6">
        {data.achievements.map((ach, idx) => (
          <div key={idx} className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-3 relative overflow-hidden group hover:border-[#ff2a2a] transition-all duration-300">
            <div className="absolute top-0 right-0 p-8 text-zinc-800/10 group-hover:text-[#ff2a2a]/10 transition-colors pointer-events-none">
              <Award className="w-24 h-24" />
            </div>
            <span className="text-[10px] font-mono text-[#ff2a2a] tracking-widest uppercase font-bold">// {ach.date}</span>
            <h3 className="text-xl font-black text-white">{ach.title}</h3>
            <p className="text-sm text-zinc-400 max-w-2xl leading-relaxed">{ach.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AchievementsPage;
