import { Skeleton } from './Skeleton';
import { AlertCircle } from 'lucide-react';

export function PageSkeleton({ type = 'list' }) {
  if (type === 'dashboard') {
    return (
      <div className="space-y-8 pb-24">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 block">
              <div className="flex items-center justify-between">
                <div>
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-12 mt-2" />
                </div>
                <Skeleton className="w-12 h-12 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'messages') {
    return (
      <div className="space-y-6 pb-24">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-4 w-72 mt-2" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-10 w-32 rounded-xl" />
            <Skeleton className="h-10 w-24 rounded-xl" />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Skeleton className="h-11 flex-1 rounded-xl" />
          <Skeleton className="h-11 w-40 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col lg:flex-row gap-6 justify-between">
              <div className="flex-1 space-y-4 lg:pl-4">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="flex lg:flex-col gap-2 w-full lg:w-[140px] shrink-0">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'form') {
    return (
      <div className="space-y-6 pb-24 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-10 w-24 rounded-lg" />
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6">
          <Skeleton className="h-6 w-32" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-11 w-full rounded-lg" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-11 w-full rounded-lg" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-32 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default to list view
  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-24 rounded-lg" />
      </div>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-11 w-full rounded-lg" />
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-11 w-full rounded-lg" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-24 w-full rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ErrorState({ error, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-32 space-y-4">
      <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-white">Failed to load data</h3>
      <p className="text-zinc-400 text-sm max-w-md text-center">
        {error?.message || 'An unexpected error occurred while connecting to the database.'}
      </p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="mt-4 px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-medium transition-colors cursor-pointer"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
