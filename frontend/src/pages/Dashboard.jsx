import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMovies } from '../hooks/useMovies';
import MovieRow from '../components/MovieRow';
import MovieModal from '../components/MovieModal';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { genres, loading, error } = useMovies();
  const [selectedMovie, setSelectedMovie] = useState(null);

  return (
    <div className="min-h-screen bg-netflix-black">
      <header className="sticky top-0 z-40 flex items-center justify-between px-4 sm:px-8 py-4 bg-gradient-to-b from-black/80 to-transparent">
        <Link to="/" className="text-2xl sm:text-3xl font-bold text-netflix-red">
          NETFLIX
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400 hidden sm:block">{user?.name}</span>
          <button
            onClick={logout}
            className="px-4 py-2 bg-netflix-red/80 hover:bg-netflix-red rounded font-medium text-sm transition"
          >
            Sign Out
          </button>
        </div>
      </header>

      <main className="pt-8 pb-16">
        <div className="mb-8 px-4 sm:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold">Welcome back, {user?.name?.split(' ')[0] || user?.username}!</h1>
          <p className="text-gray-400 mt-1">Continue watching</p>
        </div>

        {error && (
          <div className="mx-4 sm:mx-8 mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded text-red-300">
            {error}
          </div>
        )}

        {Object.entries(genres).map(([genre, movies]) => (
          <MovieRow
            key={genre}
            title={genre}
            movies={movies}
            loading={loading}
            onSelect={(m) => setSelectedMovie(m.imdbID)}
          />
        ))}
      </main>

      {selectedMovie && (
        <MovieModal imdbID={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}
    </div>
  );
}
