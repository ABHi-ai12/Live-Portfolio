import { Skeleton } from './Skeleton';
import { AlertCircle } from 'lucide-react';

export function PageSkeleton({ type = 'list' }) {
  // 1. Dashboard Skeleton
  if (type === 'dashboard') {
    return (
      <div className="space-y-8 pb-24 max-w-6xl mx-auto animate-pulse">
        <div>
          <Skeleton className="h-9 w-48 bg-zinc-800" />
          <Skeleton className="h-4 w-80 mt-2 bg-zinc-800/60" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 h-40 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-32 bg-zinc-800" />
                  <Skeleton className="h-4 w-48 bg-zinc-800/60" />
                </div>
                <Skeleton className="w-14 h-14 rounded-2xl bg-zinc-800" />
              </div>
              <Skeleton className="h-4 w-24 bg-zinc-800/50" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 2. Home Page Skeleton
  if (type === 'home') {
    return (
      <div className="max-w-4xl mx-auto space-y-6 pb-24 animate-pulse">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-6">
          <div>
            <Skeleton className="h-8 w-36 bg-zinc-800" />
            <Skeleton className="h-4 w-72 mt-2 bg-zinc-800/60" />
          </div>
          <Skeleton className="h-10 w-24 rounded-lg bg-zinc-800" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Avatar Card */}
          <div className="bg-zinc-900/40 border border-white/5 p-6 rounded-2xl flex flex-col items-center space-y-6">
            <Skeleton className="w-32 h-32 rounded-full bg-zinc-800" />
            <div className="w-full space-y-3">
              <Skeleton className="h-4 w-20 mx-auto bg-zinc-800" />
              <Skeleton className="h-10 w-full rounded-xl bg-zinc-800" />
            </div>
          </div>

          {/* Right Inputs */}
          <div className="md:col-span-2 bg-zinc-900/40 border border-white/5 p-6 rounded-2xl space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20 bg-zinc-800" />
                <Skeleton className="h-11 w-full rounded-xl bg-zinc-800" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24 bg-zinc-800" />
                <Skeleton className="h-11 w-full rounded-xl bg-zinc-800" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-28 bg-zinc-800" />
              <Skeleton className="h-20 w-full rounded-xl bg-zinc-800" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. About Page Skeleton
  if (type === 'about') {
    return (
      <div className="max-w-4xl mx-auto space-y-6 pb-24 animate-pulse">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-6">
          <div>
            <Skeleton className="h-8 w-36 bg-zinc-800" />
            <Skeleton className="h-4 w-80 mt-2 bg-zinc-800/60" />
          </div>
          <Skeleton className="h-10 w-24 rounded-lg bg-zinc-800" />
        </div>

        <div className="bg-zinc-900/40 border border-white/5 p-6 rounded-2xl space-y-6">
          <Skeleton className="h-6 w-32 bg-zinc-800" />
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <Skeleton className="w-24 h-24 rounded-full bg-zinc-800 shrink-0" />
            <Skeleton className="h-11 w-full rounded-xl bg-zinc-800" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20 bg-zinc-800" />
            <Skeleton className="h-24 w-full rounded-xl bg-zinc-800" />
          </div>
        </div>

        {/* List Skeletons */}
        <div className="bg-zinc-900/40 border border-white/5 p-6 rounded-2xl space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-24 bg-zinc-800" />
            <Skeleton className="h-9 w-20 rounded-lg bg-zinc-800" />
          </div>
          {[...Array(2)].map((_, i) => (
            <div key={i} className="border border-white/5 rounded-xl p-4 space-y-3">
              <div className="flex justify-between">
                <Skeleton className="h-5 w-48 bg-zinc-800" />
                <Skeleton className="h-8 w-8 bg-zinc-800 rounded-lg" />
              </div>
              <Skeleton className="h-4 w-full bg-zinc-800/60" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 4. Projects Page Skeleton
  if (type === 'projects') {
    return (
      <div className="max-w-4xl mx-auto space-y-6 pb-24 animate-pulse">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-6">
          <div>
            <Skeleton className="h-8 w-44 bg-zinc-800" />
            <Skeleton className="h-4 w-72 mt-2 bg-zinc-800/60" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-10 w-28 rounded-lg bg-zinc-800" />
            <Skeleton className="h-10 w-24 rounded-lg bg-zinc-800" />
          </div>
        </div>

        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-zinc-900/40 border border-white/5 p-6 rounded-2xl space-y-6">
            <div className="flex justify-between">
              <Skeleton className="h-6 w-32 bg-zinc-800" />
              <Skeleton className="h-8 w-8 bg-zinc-800 rounded-lg" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Skeleton className="h-40 w-full rounded-xl bg-zinc-800" />
              <div className="md:col-span-2 space-y-4">
                <Skeleton className="h-11 w-full rounded-xl bg-zinc-800" />
                <Skeleton className="h-20 w-full rounded-xl bg-zinc-800" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 5. Skills Page Skeleton
  if (type === 'skills') {
    return (
      <div className="max-w-4xl mx-auto space-y-6 pb-24 animate-pulse">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-6">
          <div>
            <Skeleton className="h-8 w-36 bg-zinc-800" />
            <Skeleton className="h-4 w-64 mt-2 bg-zinc-800/60" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-10 w-28 rounded-lg bg-zinc-800" />
            <Skeleton className="h-10 w-24 rounded-lg bg-zinc-800" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-zinc-900/40 border border-white/5 p-6 rounded-2xl space-y-4">
              <Skeleton className="h-5 w-28 bg-zinc-800" />
              <div className="space-y-3">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="flex justify-between items-center">
                    <Skeleton className="h-4 w-32 bg-zinc-800" />
                    <Skeleton className="h-4 w-10 bg-zinc-800/60" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 6. Contact & Messages Skeleton
  if (type === 'contact' || type === 'messages') {
    return (
      <div className="max-w-5xl mx-auto space-y-6 pb-24 animate-pulse">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-800/80 pb-6">
          <div>
            <Skeleton className="h-8 w-44 bg-zinc-800" />
            <Skeleton className="h-4 w-80 mt-2 bg-zinc-800/60" />
          </div>
          <div className="flex gap-2 bg-zinc-900 p-1 rounded-xl border border-white/5">
            <Skeleton className="h-8 w-20 rounded-lg bg-zinc-800" />
            <Skeleton className="h-8 w-20 rounded-lg bg-zinc-800/50" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Quick Filters / Search */}
          <div className="space-y-4">
            <Skeleton className="h-11 w-full rounded-xl bg-zinc-800" />
            <div className="bg-zinc-900/40 border border-white/5 p-4 rounded-xl space-y-3">
              <Skeleton className="h-5 w-24 bg-zinc-800" />
              <Skeleton className="h-8 w-full bg-zinc-800/50 rounded-lg" />
              <Skeleton className="h-8 w-full bg-zinc-800/50 rounded-lg" />
            </div>
          </div>

          {/* Messages list */}
          <div className="md:col-span-2 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-zinc-900/40 border border-white/5 p-6 rounded-2xl space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-36 bg-zinc-800" />
                    <Skeleton className="h-4 w-48 bg-zinc-800/60" />
                  </div>
                  <Skeleton className="h-6 w-16 bg-zinc-800/60 rounded-full" />
                </div>
                <Skeleton className="h-12 w-full bg-zinc-800/40 rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Fallback default skeleton
  return (
    <div className="space-y-6 pb-24 max-w-4xl mx-auto animate-pulse">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48 bg-zinc-800" />
        <Skeleton className="h-10 w-24 rounded-lg bg-zinc-800" />
      </div>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6 space-y-4">
          <Skeleton className="h-6 w-32 bg-zinc-800" />
          <Skeleton className="h-4 w-full bg-zinc-800/50" />
          <Skeleton className="h-4 w-3/4 bg-zinc-800/50" />
        </div>
      ))}
    </div>
  );
}

export function ErrorState({ error, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-32 space-y-4">
      <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 animate-pulse">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-white">Failed to load data</h3>
      <p className="text-zinc-400 text-sm max-w-md text-center leading-relaxed">
        {error?.message || 'An unexpected error occurred while connecting to the database.'}
      </p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="mt-4 px-6 py-2.5 bg-white text-black hover:bg-zinc-200 rounded-lg font-medium transition-colors cursor-pointer"
        >
          Try Again
        </button>
      )}
    </div>
  );
}

