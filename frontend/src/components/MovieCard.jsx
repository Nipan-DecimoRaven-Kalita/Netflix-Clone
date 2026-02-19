import React from 'react';

export default function MovieCard({ movie, onClick }) {
  return (
    <button
      onClick={() => onClick(movie)}
      className="flex-shrink-0 w-[160px] sm:w-[200px] group cursor-pointer outline-none focus:ring-2 focus:ring-netflix-red rounded overflow-hidden transition-transform duration-200 hover:scale-110 hover:z-10"
    >
      <div className="relative aspect-[2/3] bg-gray-800 rounded overflow-hidden">
        {movie.Poster && movie.Poster !== 'N/A' ? (
          <img
            src={movie.Poster}
            alt={movie.Title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
            No poster
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <p className="font-semibold text-sm truncate">{movie.Title}</p>
          <p className="text-xs text-gray-400">{movie.Year}</p>
        </div>
      </div>
    </button>
  );
}
