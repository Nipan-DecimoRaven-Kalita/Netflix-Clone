import React from 'react';
import MovieCard from './MovieCard';
import MovieCardSkeleton from './MovieCardSkeleton';

export default function MovieRow({ title, movies, onSelect, loading }) {
  return (
    <div className="mb-10">
      <h2 className="text-xl font-bold mb-4 px-4 sm:px-8">{title}</h2>
      <div className="flex gap-3 overflow-x-auto scroll-row pb-4 px-4 sm:px-8">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <MovieCardSkeleton key={i} />)
          : movies?.map((movie) => (
              <MovieCard key={movie.imdbID} movie={movie} onClick={onSelect} />
            ))}
      </div>
    </div>
  );
}
