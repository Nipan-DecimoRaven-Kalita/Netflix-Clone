import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOVIES } from '../lib/api';

export function MovieModal({ imdbID, onClose }) {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(!!imdbID);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!imdbID) {
      setMovie(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    MOVIES.byId(imdbID)
      .then((data) => setMovie(data.movie))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [imdbID]);

  const posterUrl = movie?.Poster && movie.Poster !== 'N/A' ? movie.Poster : null;

  return (
    <AnimatePresence>
      {imdbID && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className="bg-netflix-black rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            {loading && (
              <div className="p-12 flex justify-center">
                <div className="w-12 h-12 border-4 border-netflix-red border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            {error && (
              <div className="p-8 text-center text-red-400">{error}</div>
            )}
            {movie && !loading && (
              <>
                <div className="relative">
                  <div className="aspect-video bg-gray-900">
                    {posterUrl ? (
                      <img src={posterUrl} alt={movie.Title} className="w-full h-full object-contain" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">No image</div>
                    )}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-netflix-black to-transparent" />
                </div>
                <div className="p-6 -mt-16 relative">
                  <h2 className="text-2xl font-bold text-white">{movie.Title}</h2>
                  <div className="flex flex-wrap gap-2 text-sm text-gray-400 mt-1">
                    {movie.Year && <span>{movie.Year}</span>}
                    {movie.Rated && <span>• {movie.Rated}</span>}
                    {movie.Runtime && <span>• {movie.Runtime}</span>}
                    {movie.imdbRating && <span>• IMDB {movie.imdbRating}</span>}
                  </div>
                  {movie.Genre && <p className="text-gray-400 text-sm mt-2">{movie.Genre}</p>}
                  {movie.Plot && <p className="text-gray-300 mt-3">{movie.Plot}</p>}
                  {movie.Actors && (
                    <p className="text-sm text-gray-400 mt-2"><span className="text-gray-500">Actors:</span> {movie.Actors}</p>
                  )}
                  {movie.Director && (
                    <p className="text-sm text-gray-400"><span className="text-gray-500">Director:</span> {movie.Director}</p>
                  )}
                </div>
              </>
            )}
            <div className="p-4 border-t border-gray-800 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
