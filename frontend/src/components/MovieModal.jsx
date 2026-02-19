import React, { useState, useEffect } from 'react';
import api from '../lib/api';

export default function MovieModal({ imdbID, onClose }) {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!imdbID) return;
    api
      .get(`/movies/${imdbID}`)
      .then(({ data }) => setMovie(data))
      .catch(() => setMovie(null))
      .finally(() => setLoading(false));
  }, [imdbID]);

  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!imdbID) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-netflix-black-soft rounded-lg shadow-2xl border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 flex items-center justify-center text-xl z-10"
        >
          ×
        </button>

        {loading ? (
          <div className="p-8 flex items-center justify-center min-h-[300px]">
            <div className="animate-pulse text-netflix-red">Loading...</div>
          </div>
        ) : movie ? (
          <div className="flex flex-col md:flex-row">
            <div className="flex-shrink-0 w-full md:w-1/3">
              {movie.Poster && movie.Poster !== 'N/A' ? (
                <img
                  src={movie.Poster}
                  alt={movie.Title}
                  className="w-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                />
              ) : (
                <div className="aspect-[2/3] bg-gray-800 flex items-center justify-center rounded-t-lg md:rounded-l-lg">
                  No poster
                </div>
              )}
            </div>
            <div className="p-6 md:p-8 flex-1">
              <h2 className="text-2xl font-bold mb-2">{movie.Title}</h2>
              <div className="flex gap-4 text-gray-400 text-sm mb-4">
                <span>{movie.Year}</span>
                {movie.Runtime && <span>{movie.Runtime}</span>}
                {movie.imdbRating && (
                  <span className="text-yellow-400">★ {movie.imdbRating}</span>
                )}
              </div>
              {movie.Genre && (
                <p className="text-sm text-gray-300 mb-2">{movie.Genre}</p>
              )}
              <p className="text-gray-300 mb-4 leading-relaxed">{movie.Plot}</p>
              {movie.Director && (
                <p className="text-sm mb-1">
                  <span className="text-gray-500">Director:</span> {movie.Director}
                </p>
              )}
              {movie.Actors && (
                <p className="text-sm mb-1">
                  <span className="text-gray-500">Cast:</span> {movie.Actors}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-400">Movie not found</div>
        )}
      </div>
    </div>
  );
}
