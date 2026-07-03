import React, { useState, useEffect } from 'react';
import { db } from '../lib/db';
import SubPageHeader from '../components/SubPageHeader';

const BlogsPage = () => {
  const [data, setData] = useState(db.getData());
  const [selectedBlog, setSelectedBlog] = useState(null);

  useEffect(() => {
    const handleUpdate = () => setData(db.getData());
    window.addEventListener("portfolio_db_updated", handleUpdate);
    return () => window.removeEventListener("portfolio_db_updated", handleUpdate);
  }, []);

  return (
    <div className="bg-zinc-950 min-h-screen text-white font-sans pb-24">
      <SubPageHeader title="Blogs & Articles" subtitle="My written thoughts on frontend engineering, developer toolchains, and software architecture." />

      <div className="max-w-4xl mx-auto px-6 md:px-12 mt-16 space-y-8">
        {selectedBlog ? (
          // Full Blog Article View
          <div className="space-y-6 bg-zinc-900 border border-zinc-800 p-8 md:p-12 rounded-3xl">
            <button 
              onClick={() => setSelectedBlog(null)}
              className="text-xs font-mono text-[var(--theme-color)] hover:underline flex items-center gap-1 uppercase font-bold cursor-pointer"
            >
              &larr; Back to Feed
            </button>
            <div className="space-y-2 border-b border-zinc-850 pb-6">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{selectedBlog.date} | {selectedBlog.readTime}</span>
              <h1 className="text-3xl md:text-4xl font-black text-white">{selectedBlog.title}</h1>
            </div>
            <p className="text-zinc-300 leading-relaxed text-base whitespace-pre-wrap">{selectedBlog.content}</p>
          </div>
        ) : (
          // Blog List Feed View
          <div className="space-y-6">
            {data.blogs.map((blog, idx) => (
              <div 
                key={idx} 
                className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4 hover:border-[var(--theme-color)] transition-all cursor-pointer"
                onClick={() => setSelectedBlog(blog)}
              >
                <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                  <span>{blog.date}</span>
                  <span>{blog.readTime}</span>
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-[var(--theme-color)] transition-colors">{blog.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{blog.excerpt}</p>
                <span className="text-xs font-mono text-[var(--theme-color)] uppercase font-bold tracking-wider hover:underline block pt-2">
                  Read Article &rarr;
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogsPage;
