import { useState, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(() => {
    try {
      return !!localStorage.getItem('netflix_remember');
    } catch {
      return false;
    }
  });
  const [submitting, setSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!identifier.trim() || !password || submitting || cooldown > 0) return;
      setSubmitting(true);
      try {
        await login(identifier.trim(), password, remember);
        toast.success('Welcome back!');
        navigate('/', { replace: true });
      } catch (err) {
        const msg = err.message || '';
        const isNetworkError = msg === 'Failed to fetch' || msg.includes('NetworkError') || err.name === 'TypeError';
        toast.error(isNetworkError
          ? "Can't reach the server. Start the backend: run npm run dev from the project folder (backend on port 5000)."
          : (msg || 'Login failed'));
        if (err.data?.cooldownSeconds) setCooldown(err.data.cooldownSeconds);
      } finally {
        setSubmitting(false);
      }
    },
    [identifier, password, remember, login, navigate, submitting, cooldown]
  );

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => (c <= 1 ? 0 : c - 1)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-netflix-black via-netflix-black to-black flex flex-col">
      <header className="p-4 md:p-6">
        <Link to="/" className="inline-block">
          <span className="text-netflix-red text-3xl font-bold tracking-tight">NETFLIX</span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center p-4 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <h1 className="text-3xl font-bold mb-6">Sign In</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Username or Email</label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Username or email"
                className="w-full bg-gray-800/80 border border-gray-600 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-netflix-red focus:border-transparent"
                autoComplete="username"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-gray-800/80 border border-gray-600 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-netflix-red focus:border-transparent pr-12"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-sm"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-netflix-red focus:ring-netflix-red"
                />
                <span className="text-sm text-gray-400">Remember me (30 days)</span>
              </label>
              <Link to="/login" className="text-sm text-gray-400 hover:text-netflix-red">Forgot password?</Link>
            </div>
            <button
              type="submit"
              disabled={submitting || cooldown > 0}
              className="w-full py-3 bg-netflix-red rounded font-semibold text-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
            >
              {submitting ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
              {cooldown > 0 ? `Try again in ${cooldown}s` : 'Sign In'}
            </button>
          </form>
          <p className="text-gray-400 mt-6 text-center">
            New to Netflix?{' '}
            <Link to="/register" className="text-netflix-red hover:underline">Create an account</Link>
          </p>
        </motion.div>
      </main>
    </div>
  );
}
