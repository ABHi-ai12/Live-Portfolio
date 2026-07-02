import React, { useState, useEffect } from 'react';
import { db } from '../lib/db';
import SubPageHeader from '../components/SubPageHeader';
import { Code, Laptop, Cloud, HelpCircle } from 'lucide-react';

const iconMap = {
  Code: Code,
  Laptop: Laptop,
  Cloud: Cloud
};

const ServicesPage = () => {
  const [data, setData] = useState(db.getData());

  useEffect(() => {
    const handleUpdate = () => setData(db.getData());
    window.addEventListener("portfolio_db_updated", handleUpdate);
    return () => window.removeEventListener("portfolio_db_updated", handleUpdate);
  }, []);

  return (
    <div className="bg-zinc-950 min-h-screen text-white font-sans pb-24">
      <SubPageHeader title="Services Provided" subtitle="How I help product brands build fast, scalability-focused full stack systems." />

      <div className="max-w-6xl mx-auto px-6 md:px-12 mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.services.map((srv, idx) => {
          const IconComp = iconMap[srv.icon] || HelpCircle;
          return (
            <div key={idx} className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-6 flex flex-col justify-between hover:border-[#ff2a2a] transition-all">
              <div className="space-y-4">
                <div className="p-3 bg-[#ff2a2a]/10 rounded-2xl text-[#ff2a2a] w-fit">
                  <IconComp className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">{srv.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{srv.description}</p>
              </div>
              <div className="pt-4 border-t border-zinc-850 flex items-center justify-between text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                <span>0{idx + 1} / SERVICE</span>
                <span className="text-[#ff2a2a]">ACTIVE</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ServicesPage;
