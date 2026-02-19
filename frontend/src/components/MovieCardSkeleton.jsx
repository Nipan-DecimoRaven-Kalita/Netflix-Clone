import React from 'react';

export default function MovieCardSkeleton() {
  return (
    <div className="flex-shrink-0 w-[160px] sm:w-[200px] animate-pulse">
      <div className="aspect-[2/3] bg-gray-800 rounded overflow-hidden" />
    </div>
  );
}
