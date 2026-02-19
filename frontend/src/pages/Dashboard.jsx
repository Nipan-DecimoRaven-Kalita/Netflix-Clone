import { useState, useCallback, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useMovies, useSearch } from '../hooks/useMovies';
import { MovieRow } from '../components/MovieRow';
import { MovieModal } from '../components/MovieModal';

const ROWS = [
  { key: 'trending', title: 'Trending Now', getMovies: (d) => d.trending },
  { key: 'topRated', title: 'Top Rated', getMovies: (d) => d.topRated },
  { key: 'action', title: 'Action Movies', getMovies: (d) => d.action },
  { key: 'latest2025', title: 'Latest 2025', getMovies: (d) => d.latest2025 },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalId, setModalId] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);

  const { trending, topRated, action, latest2025, loading, error } = useMovies();
  const { movies: searchResults, loading: searchLoading } = useSearch(searchQuery);

  const data = { trending, topRated, action, latest2025 };
  const heroMovie = trending[0] || topRated[0] || action[0];
  const searchRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    toast.success('Signed out');
    navigate('/login');
    setProfileOpen(false);
  }, [logout, navigate]);

  const openModal = useCallback((movie) => {
    if (movie?.imdbID) setModalId(movie.imdbID);
  }, []);

  if (error) toast.error(error);

  return (
    <div className="min-h-screen bg-gradient-to-b from-netflix-black to-black">
      <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 md:px-8 py-3 bg-gradient-to-b from-black/80 to-transparent transition-all">
        <Link to="/" className="text-netflix-red text-2xl font-bold tracking-tight">NETFLIX</Link>
        <div className="flex items-center gap-4">
          <div className="relative" ref={searchRef}>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setSearchOpen((o) => !o); }}
              className="p-2 text-white hover:text-gray-300"
              aria-label="Search"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
            {searchOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 top-full mt-1 w-72 md:w-96 bg-gray-900/95 border border-gray-700 rounded shadow-xl overflow-hidden"
              >
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search movies..."
                  className="w-full px-4 py-3 bg-transparent text-white placeholder-gray-500 focus:outline-none border-b border-gray-700"
                  autoFocus
                />
                <div className="max-h-64 overflow-y-auto">
                  {searchLoading && <div className="p-4 text-center text-gray-400">Searching...</div>}
                  {!searchLoading && searchQuery.trim() && searchResults.length === 0 && <div className="p-4 text-gray-400">No results</div>}
                  {!searchLoading && searchResults.slice(0, 8).map((m) => (
                    <button
                      key={m.imdbID}
                      type="button"
                      onClick={() => { openModal(m); setSearchOpen(false); setSearchQuery(''); }}
                      className="w-full flex items-center gap-3 p-3 hover:bg-gray-800 text-left"
                    >
                      <img src={m.Poster && m.Poster !== 'N/A' ? m.Poster : 'https://via.placeholder.com/40x60/333/666?text=?'} alt="" className="w-10 h-14 object-cover rounded" />
                      <span className="text-white truncate">{m.Title} ({m.Year})</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setProfileOpen((o) => !o); }}
              className="flex items-center gap-2 text-white"
              aria-label="Profile"
            >
              <div className="w-8 h-8 rounded bg-netflix-red flex items-center justify-center text-sm font-bold">
                {(user?.name || user?.username || 'U').charAt(0).toUpperCase()}
              </div>
            </button>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 top-full mt-2 w-48 py-2 bg-gray-900/95 border border-gray-700 rounded shadow-xl"
              >
                <p className="px-4 py-2 text-sm text-gray-400 truncate">{user?.email}</p>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm text-white hover:bg-gray-800"
                >
                  Sign out
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </nav>

      {heroMovie && (
        <section className="relative h-[50vh] min-h-[320px] flex items-end pb-12 pt-24 px-4 md:px-8">
          <div className="absolute inset-0 bg-gradient-hero z-0" />
          <div className="absolute inset-0 z-0">
            <img
              src={heroMovie.Poster && heroMovie.Poster !== 'N/A' ? heroMovie.Poster : 'https://via.placeholder.com/1920x1080/1a1a1a/333'}
              alt=""
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-netflix" />
          </div>
          <div className="relative z-10 max-w-xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg"
            >
              {heroMovie.Title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-gray-200 mt-2"
            >
              {heroMovie.Year}
            </motion.p>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              type="button"
              onClick={() => openModal(heroMovie)}
              className="mt-4 px-6 py-2.5 bg-white/90 text-black rounded font-semibold hover:bg-white transition"
            >
              More Info
            </motion.button>
          </div>
        </section>
      )}

      <div className="pt-6 pb-12">
        {ROWS.map((row) => (
          <MovieRow
            key={row.key}
            title={row.title}
            movies={row.getMovies(data)}
            loading={loading}
            onMovieClick={openModal}
          />
        ))}
      </div>

      <MovieModal imdbID={modalId} onClose={() => setModalId(null)} />
    </div>
  );
}
