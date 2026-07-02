import React, { useState, useEffect } from 'react';
import { db } from '../lib/db';
import SubPageHeader from '../components/SubPageHeader';

const ExperiencePage = () => {
  const [data, setData] = useState(db.getData());

  useEffect(() => {
    const handleUpdate = () => setData(db.getData());
    window.addEventListener("portfolio_db_updated", handleUpdate);
    return () => window.removeEventListener("portfolio_db_updated", handleUpdate);
  }, []);

  return (
    <div className="bg-zinc-950 min-h-screen text-white font-sans pb-24">
      <SubPageHeader title="Work Experience" subtitle="Chronological timeline of my professional roles and software achievements." />

      <div className="max-w-4xl mx-auto px-6 md:px-12 mt-16 space-y-12">
        <div className="space-y-12 border-l border-zinc-800 pl-8 ml-2">
          {data.experience.map((exp, idx) => (
            <div key={idx} className="relative space-y-2">
              <div className="absolute -left-[37px] top-1.5 w-3 h-3 rounded-full bg-[#ff2a2a] shadow-[0_0_10px_#ff2a2a]" />
              <div className="flex justify-between items-baseline text-xs text-zinc-500 font-mono">
                <span className="font-bold text-zinc-350">{exp.company}</span>
                <span>{exp.duration}</span>
              </div>
              <h3 className="text-xl font-bold text-white">{exp.role}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed max-w-2xl">{exp.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExperiencePage;
