import React, { useState, useEffect } from 'react';
import { db } from '../lib/db';
import SubPageHeader from '../components/SubPageHeader';

const PrivacyPolicyPage = () => {
  const [data, setData] = useState(db.getData());

  useEffect(() => {
    const handleUpdate = () => setData(db.getData());
    window.addEventListener("portfolio_db_updated", handleUpdate);
    return () => window.removeEventListener("portfolio_db_updated", handleUpdate);
  }, []);

  return (
    <div className="bg-zinc-950 min-h-screen text-white font-sans pb-24">
      <SubPageHeader title="Privacy Policy" subtitle="Information regarding data handling, tracking, and details processing." />

      <div className="max-w-4xl mx-auto px-6 md:px-12 mt-16">
        <div className="p-8 md:p-12 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-6">
          <h2 className="text-xl font-bold text-white border-b border-zinc-850 pb-3">// Data Statement</h2>
          <p className="text-sm text-zinc-450 leading-relaxed whitespace-pre-wrap">{data.privacy}</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
