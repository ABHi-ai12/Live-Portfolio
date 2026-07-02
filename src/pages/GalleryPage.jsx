import React, { useState, useEffect } from 'react';
import { db } from '../lib/db';
import SubPageHeader from '../components/SubPageHeader';

const GalleryPage = () => {
  const [data, setData] = useState(db.getData());

  useEffect(() => {
    const handleUpdate = () => setData(db.getData());
    window.addEventListener("portfolio_db_updated", handleUpdate);
    return () => window.removeEventListener("portfolio_db_updated", handleUpdate);
  }, []);

  return (
    <div className="bg-zinc-950 min-h-screen text-white font-sans pb-24">
      <SubPageHeader title="Visual Gallery" subtitle="Snapshots from my coding workstation, creative process, and physical tech setup." />

      <div className="max-w-6xl mx-auto px-6 md:px-12 mt-16 grid grid-cols-1 sm:grid-cols-2 gap-8">
        {data.gallery.map((item, idx) => (
          <div key={idx} className="p-4 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4 group overflow-hidden">
            <div className="w-full aspect-[16/10] overflow-hidden rounded-2xl bg-zinc-950 relative border border-zinc-850">
              <img 
                src={item.url} 
                alt={item.caption} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
            </div>
            <p className="text-xs text-zinc-400 font-mono italic leading-relaxed px-1">{item.caption}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryPage;
