import React, { useState, useEffect } from 'react';
import { db } from '../lib/db';
import SubPageHeader from '../components/SubPageHeader';

const ResumePage = () => {
  const [data, setData] = useState(db.getData());

  useEffect(() => {
    const handleUpdate = () => setData(db.getData());
    window.addEventListener("portfolio_db_updated", handleUpdate);
    return () => window.removeEventListener("portfolio_db_updated", handleUpdate);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-zinc-950 min-h-screen text-white font-sans pb-24 print:bg-white print:text-black">
      <div className="print:hidden">
        <SubPageHeader title="Resume" subtitle="Detailed professional credentials, certifications, and academic background." />
      </div>

      <div className="max-w-4xl mx-auto px-6 md:px-12 mt-16 space-y-10">
        {/* Action Button */}
        <div className="flex justify-end print:hidden">
          <button 
            onClick={handlePrint}
            className="px-6 py-2.5 rounded-full bg-[var(--theme-color)] text-white font-bold hover:bg-white hover:text-[var(--theme-color)] transition-all duration-300 shadow-lg text-sm cursor-pointer"
          >
            Print Resume
          </button>
        </div>

        {/* Paper Container */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 md:p-12 shadow-2xl space-y-10 print:border-none print:bg-white print:p-0 print:text-black print:shadow-none">
          {/* Header */}
          <div className="border-b border-zinc-850 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 print:border-black print:pb-4">
            <div>
              <h1 className="text-4xl font-black tracking-tight print:text-black">{data.personal.name}</h1>
              <p className="text-[var(--theme-color)] font-mono tracking-widest text-xs uppercase font-bold mt-1 print:text-zinc-700">{data.personal.headline}</p>
            </div>
            <div className="text-xs font-mono text-zinc-450 space-y-1 text-left md:text-right print:text-black">
              <p>Email: {data.personal.email}</p>
              <p>Phone: {data.personal.phone}</p>
              <p>Location: {data.personal.location}</p>
            </div>
          </div>

          {/* Profile About */}
          <div className="space-y-3">
            <h2 className="text-sm font-mono tracking-[0.2em] uppercase text-[var(--theme-color)] font-bold print:text-zinc-900">// Summary</h2>
            <p className="text-sm text-zinc-350 leading-relaxed print:text-black">{data.personal.about}</p>
          </div>

          {/* Experience Grid */}
          <div className="space-y-6">
            <h2 className="text-sm font-mono tracking-[0.2em] uppercase text-[var(--theme-color)] font-bold print:text-zinc-900">// Work Experience</h2>
            <div className="space-y-6">
              {data.experience.map((exp, idx) => (
                <div key={idx} className="space-y-2 border-l border-zinc-800 pl-4 ml-1 print:border-black">
                  <div className="flex justify-between items-baseline text-xs text-zinc-500 font-mono print:text-zinc-700">
                    <span className="font-bold text-zinc-300 print:text-zinc-800">{exp.company}</span>
                    <span>{exp.duration}</span>
                  </div>
                  <h3 className="text-base font-bold text-white print:text-black">{exp.role}</h3>
                  <p className="text-xs text-zinc-400 print:text-black">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Education Grid */}
          <div className="space-y-6">
            <h2 className="text-sm font-mono tracking-[0.2em] uppercase text-[var(--theme-color)] font-bold print:text-zinc-900">// Education</h2>
            <div className="space-y-6">
              {data.education.map((edu, idx) => (
                <div key={idx} className="space-y-2 border-l border-zinc-800 pl-4 ml-1 print:border-black">
                  <div className="flex justify-between items-baseline text-xs text-zinc-500 font-mono print:text-zinc-700">
                    <span className="font-bold text-zinc-300 print:text-zinc-800">{edu.school}</span>
                    <span>{edu.duration}</span>
                  </div>
                  <h3 className="text-base font-bold text-white print:text-black">{edu.degree}</h3>
                  <p className="text-xs text-zinc-400 print:text-black">{edu.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Tag List */}
          <div className="space-y-3">
            <h2 className="text-sm font-mono tracking-[0.2em] uppercase text-[var(--theme-color)] font-bold print:text-zinc-900">// Core Arsenal</h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((s, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded bg-zinc-800 text-zinc-300 text-xs font-mono border border-zinc-800 print:bg-zinc-100 print:text-black print:border-zinc-300">
                  {s.name} ({s.level})
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePage;
