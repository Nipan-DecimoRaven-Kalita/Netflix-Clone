import { useState } from 'react';
import { motion } from 'framer-motion';

const OMDB_POSTER = (url) => url && url !== 'N/A' ? url : null;

export function MovieCard({ movie, onClick }) {
  const [loaded, setLoaded] = useState(false);
  const posterUrl = OMDB_POSTER(movie.Poster) || `https://via.placeholder.com/200x300/333/666?text=${encodeURIComponent(movie.Title || '')}`;

  return (
    <motion.div
      layout
      className="flex-shrink-0 w-[140px] sm:w-[160px] md:w-[180px] cursor-pointer group"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
      onClick={() => onClick(movie)}
    >
      <div className="relative aspect-[2/3] rounded overflow-hidden bg-gray-800 shadow-lg">
        <img
          src={posterUrl}
          alt={movie.Title}
          className="w-full h-full object-cover"
          loading="lazy"
          onLoad={() => setLoaded(true)}
        />
        {!loaded && <div className="absolute inset-0 bg-gray-800 animate-pulse" />}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="w-14 h-14 rounded-full border-2 border-white flex items-center justify-center text-2xl pl-1">▶</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <p className="text-white text-sm font-medium truncate">{movie.Title}</p>
          {movie.Year && <p className="text-gray-300 text-xs">{movie.Year}</p>}
        </div>
      </div>
      <div className="mt-1 px-0.5">
        <p className="text-sm font-medium truncate text-white">{movie.Title}</p>
        <p className="text-xs text-gray-400">{movie.Year} {movie.imdbID && movie.imdbRating ? `• IMDB ${movie.imdbRating}` : ''}</p>
      </div>
    </motion.div>
  );
}
