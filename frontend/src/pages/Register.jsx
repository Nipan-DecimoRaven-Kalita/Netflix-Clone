import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isValidEmail, isValidPassword, getPasswordErrors } from '../lib/validation';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = [];
    if (!username || username.length < 3) errs.push('Username must be at least 3 characters');
    if (!email) errs.push('Email is required');
    else if (!isValidEmail(email)) errs.push('Invalid email format');
    if (!name || name.length < 2) errs.push('Full name must be at least 2 characters');
    if (!password) errs.push('Password is required');
    else if (!isValidPassword(password)) {
      errs.push(...getPasswordErrors(password));
    }
    if (errs.length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    setErrors([]);
    try {
      await register(username, email, name, password);
      navigate('/', { replace: true });
    } catch (err) {
      setErrors(err.response?.data?.errors || ['Registration failed. Try again.']);
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
            <h1 className="text-3xl font-bold mb-6">Sign Up</h1>
            <form onSubmit={handleSubmit} className="space-y-5">
              {errors.length > 0 && (
                <div className="p-3 bg-red-500/20 border border-red-500/50 rounded text-red-300 text-sm">
                  {errors.map((e, i) => (
                    <p key={i}>{e}</p>
                  ))}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900/80 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-netflix-red focus:border-transparent placeholder-gray-500"
                  placeholder="johndoe"
                  autoComplete="username"
                  disabled={loading}
                />
              </div>
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
                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900/80 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-netflix-red focus:border-transparent placeholder-gray-500"
                  placeholder="John Doe"
                  autoComplete="name"
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
                  autoComplete="new-password"
                  disabled={loading}
                />
                <p className="mt-1 text-xs text-gray-500">
                  8+ chars, uppercase, number, special char (@$!%*?&)
                </p>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-netflix-red hover:bg-red-600 rounded font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </form>
            <p className="mt-6 text-gray-400 text-center">
              Already have an account?{' '}
              <Link to="/login" className="text-white hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
