import React, { useState, useEffect } from 'react';
import { db } from '../lib/db';
import SubPageHeader from '../components/SubPageHeader';

const FaqPage = () => {
  const [data, setData] = useState(db.getData());

  useEffect(() => {
    const handleUpdate = () => setData(db.getData());
    window.addEventListener("portfolio_db_updated", handleUpdate);
    return () => window.removeEventListener("portfolio_db_updated", handleUpdate);
  }, []);

  return (
    <div className="bg-zinc-950 min-h-screen text-white font-sans pb-24">
      <SubPageHeader title="FAQ" subtitle="Common inquiries regarding client milestones, consulting, and full-stack tech stacks." />

      <div className="max-w-4xl mx-auto px-6 md:px-12 mt-16 space-y-6">
        {data.faqs.map((faq, idx) => (
          <details 
            key={idx} 
            className="group p-6 rounded-3xl bg-zinc-900 border border-zinc-800 [&_summary::-webkit-details-marker]:hidden cursor-pointer hover:border-[#ff2a2a] transition-all"
          >
            <summary className="flex justify-between items-center text-base font-bold text-white outline-none">
              <span>{faq.question}</span>
              <span className="p-1.5 bg-[#ff2a2a]/10 text-[#ff2a2a] rounded-lg group-open:rotate-180 transition-transform">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </summary>
            <p className="mt-4 text-sm text-zinc-400 leading-relaxed border-t border-zinc-850 pt-4">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </div>
  );
};

export default FaqPage;
