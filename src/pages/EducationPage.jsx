import React, { useState, useEffect } from 'react';
import { db } from '../lib/db';
import SubPageHeader from '../components/SubPageHeader';

const EducationPage = () => {
  const [data, setData] = useState(db.getData());

  useEffect(() => {
    const handleUpdate = () => setData(db.getData());
    window.addEventListener("portfolio_db_updated", handleUpdate);
    return () => window.removeEventListener("portfolio_db_updated", handleUpdate);
  }, []);

  return (
    <div className="bg-zinc-950 min-h-screen text-white font-sans pb-24">
      <SubPageHeader title="Education" subtitle="Degrees, colleges, academic duration, and study achievements." />

      <div className="max-w-4xl mx-auto px-6 md:px-12 mt-16 space-y-12">
        <div className="space-y-12 border-l border-zinc-800 pl-8 ml-2">
          {data.education.map((edu, idx) => (
            <div key={idx} className="relative space-y-2">
              <div className="absolute -left-[37px] top-1.5 w-3 h-3 rounded-full bg-[var(--theme-color)] shadow-[0_0_10px_var(--theme-color)]" />
              <div className="flex justify-between items-baseline text-xs text-zinc-500 font-mono">
                <span className="font-bold text-zinc-350">{edu.school}</span>
                <span>{edu.duration}</span>
              </div>
              <h3 className="text-xl font-bold text-white">{edu.degree}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed max-w-2xl">{edu.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EducationPage;
