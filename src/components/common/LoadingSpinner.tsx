import { Anchor } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
}

export default function LoadingSpinner({ message = '로딩 중...' }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
      <div className="relative">
        <Anchor className="w-12 h-12 text-blue-400 animate-bounce" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
        </div>
      </div>
      <p className="mt-4 text-gray-400 text-sm">{message}</p>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gray-700 rounded" />
        <div className="h-8 w-48 bg-gray-700 rounded" />
      </div>

      {/* Content skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="h-6 w-32 bg-gray-700 rounded mb-4" />
          <div className="space-y-3">
            <div className="h-4 w-full bg-gray-700 rounded" />
            <div className="h-4 w-3/4 bg-gray-700 rounded" />
            <div className="h-4 w-5/6 bg-gray-700 rounded" />
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="h-6 w-32 bg-gray-700 rounded mb-4" />
          <div className="space-y-3">
            <div className="h-4 w-full bg-gray-700 rounded" />
            <div className="h-4 w-2/3 bg-gray-700 rounded" />
            <div className="h-4 w-4/5 bg-gray-700 rounded" />
          </div>
        </div>
      </div>

      {/* Table skeleton */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="h-6 w-40 bg-gray-700 rounded mb-4" />
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 w-full bg-gray-700 rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}
