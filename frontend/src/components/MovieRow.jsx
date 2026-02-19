import { motion } from 'framer-motion';
import { MovieCard } from './MovieCard';
import { MovieCardSkeleton } from './MovieCardSkeleton';

export function MovieRow({ title, movies, loading, onMovieClick }) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold mb-3 px-4 md:px-8">{title}</h2>
      <div className="scroll-row flex gap-3 px-4 md:px-8 pb-2 overflow-x-auto">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <MovieCardSkeleton key={i} />)
          : movies.map((movie) => (
              <MovieCard key={movie.imdbID} movie={movie} onClick={onMovieClick} />
            ))}
      </div>
    </section>
  );
}
