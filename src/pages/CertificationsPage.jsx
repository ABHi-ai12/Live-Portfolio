import React, { useState, useEffect } from 'react';
import { db } from '../lib/db';
import SubPageHeader from '../components/SubPageHeader';
import { Award } from 'lucide-react';

const CertificationsPage = () => {
  const [data, setData] = useState(db.getData());

  useEffect(() => {
    const handleUpdate = () => setData(db.getData());
    window.addEventListener("portfolio_db_updated", handleUpdate);
    return () => window.removeEventListener("portfolio_db_updated", handleUpdate);
  }, []);

  return (
    <div className="bg-zinc-950 min-h-screen text-white font-sans pb-24">
      <SubPageHeader title="Certifications" subtitle="Professional credentials, courses completed, and tech validations." />

      <div className="max-w-6xl mx-auto px-6 md:px-12 mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.certifications.map((cert, idx) => (
          <div key={idx} className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-start gap-4 hover:border-[var(--theme-color)] transition-all">
            <div className="p-3 bg-[var(--theme-color)]/10 rounded-xl text-[var(--theme-color)] shrink-0">
              <Award className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold">{cert.issuer}</span>
              <h3 className="text-base font-bold text-white leading-tight">{cert.name}</h3>
              <p className="text-xs text-zinc-400">Issued: {cert.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CertificationsPage;
