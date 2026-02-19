import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isValidEmail } from '../lib/validation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = [];
    if (!email) errs.push('Email is required');
    else if (!isValidEmail(email)) errs.push('Invalid email format');
    if (!password) errs.push('Password is required');
    if (errs.length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    setErrors([]);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setErrors(err.response?.data?.errors || ['Login failed. Try again.']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-netflix-black flex flex-col">
      <header className="p-6 flex justify-between items-center">
        <Link to="/" className="text-3xl font-bold text-netflix-red">
          NETFLIX
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-black/80 backdrop-blur-sm rounded-lg p-10 shadow-2xl border border-white/10">
            <h1 className="text-3xl font-bold mb-6">Sign In</h1>
            <form onSubmit={handleSubmit} className="space-y-5">
              {errors.length > 0 && (
                <div className="p-3 bg-red-500/20 border border-red-500/50 rounded text-red-300 text-sm">
                  {errors.map((e, i) => (
                    <p key={i}>{e}</p>
                  ))}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900/80 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-netflix-red focus:border-transparent placeholder-gray-500"
                  placeholder="you@example.com"
                  autoComplete="email"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900/80 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-netflix-red focus:border-transparent placeholder-gray-500"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  disabled={loading}
                />
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-gray-400 hover:text-white block"
              >
                Forgot password?
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-netflix-red hover:bg-red-600 rounded font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
            <p className="mt-6 text-gray-400 text-center">
              New to Netflix?{' '}
              <Link to="/register" className="text-white hover:underline font-medium">
                Sign up now
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
