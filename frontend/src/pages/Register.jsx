import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { AUTH } from '../lib/api';
import {
  validateName,
  validateEmail,
  validateUsername,
  validatePassword,
  getPasswordStrength,
} from '../lib/validation';

const DEBOUNCE_MS = 400;

export default function Register() {
  const navigate = useNavigate();
  const { register: doRegister, user } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [emailChecking, setEmailChecking] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState(null);
  const [usernameError, setUsernameError] = useState('');
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const strength = getPasswordStrength(password);
  const nameValid = !nameError && name.length >= 2;
  const emailValid = !emailError && email.length > 0 && emailAvailable !== false;
  const usernameValid = !usernameError && username.length >= 3 && usernameAvailable !== false;
  const passwordValid = !passwordError && strength.level === 100;
  const confirmValid = !confirmError && confirmPassword === password && password.length > 0;
  const formValid = nameValid && emailValid && usernameValid && passwordValid && confirmValid;

  useEffect(() => {
    setNameError(validateName(name) || '');
  }, [name]);

  useEffect(() => {
    const err = validateEmail(email);
    setEmailError(err || '');
    if (err) {
      setEmailAvailable(null);
      return;
    }
    setEmailAvailable(null);
    const t = setTimeout(async () => {
      setEmailChecking(true);
      try {
        const res = await AUTH.checkEmail(email);
        setEmailAvailable(res.available);
      } catch {
        setEmailAvailable(null);
      }
      setEmailChecking(false);
    }, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [email]);

  useEffect(() => {
    const err = validateUsername(username);
    setUsernameError(err || '');
    if (err) {
      setUsernameAvailable(null);
      return;
    }
    setUsernameAvailable(null);
    const t = setTimeout(async () => {
      setUsernameChecking(true);
      try {
        const res = await AUTH.checkUsername(username);
        setUsernameAvailable(res.available);
      } catch {
        setUsernameAvailable(null);
      }
      setUsernameChecking(false);
    }, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [username]);

  useEffect(() => {
    setPasswordError(validatePassword(password) || '');
  }, [password]);

  useEffect(() => {
    if (!confirmPassword) setConfirmError('');
    else setConfirmError(confirmPassword !== password ? 'Passwords must match' : '');
  }, [confirmPassword, password]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!formValid || submitting) return;
      setSubmitting(true);
      try {
        await doRegister(name, email, username, password, confirmPassword);
        toast.success('Account created!');
        navigate('/');
      } catch (err) {
        const msg = err.message || '';
        const isNetworkError = msg === 'Failed to fetch' || msg.includes('NetworkError') || err.name === 'TypeError';
        toast.error(isNetworkError
          ? "Can't reach the server. Start the backend: run npm run dev from the project folder (backend on port 5000)."
          : (msg || 'Registration failed'));
      } finally {
        setSubmitting(false);
      }
    },
    [formValid, submitting, doRegister, name, email, username, password, confirmPassword, navigate]
  );

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

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
          <h1 className="text-3xl font-bold mb-6">Create Account</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value.trimStart())}
                  placeholder="John Doe"
                  className="w-full bg-gray-800/80 border border-gray-600 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-netflix-red focus:border-transparent"
                  autoComplete="name"
                />
                {nameValid && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">✓</span>}
                {nameError && <span className="absolute right-10 top-1/2 -translate-y-1/2 text-red-500">✕</span>}
              </div>
              {nameError && <p className="text-red-400 text-sm mt-1">{nameError}</p>}
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Email</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.trim().toLowerCase())}
                  placeholder="you@example.com"
                  className="w-full bg-gray-800/80 border border-gray-600 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-netflix-red focus:border-transparent"
                  autoComplete="email"
                />
                {emailChecking && <span className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 border-2 border-netflix-red border-t-transparent rounded-full animate-spin" />}
                {!emailChecking && emailValid && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">✓</span>}
                {!emailChecking && email.length > 0 && !emailError && emailAvailable === false && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">✕</span>}
              </div>
              {emailError && <p className="text-red-400 text-sm mt-1">{emailError}</p>}
              {!emailError && email.length > 0 && emailAvailable === false && <p className="text-red-400 text-sm mt-1">Email already registered</p>}
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Username</label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.replace(/\s/g, ''))}
                  placeholder="johndoe"
                  className="w-full bg-gray-800/80 border border-gray-600 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-netflix-red focus:border-transparent"
                  autoComplete="username"
                />
                {usernameChecking && <span className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 border-2 border-netflix-red border-t-transparent rounded-full animate-spin" />}
                {!usernameChecking && usernameValid && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">✓</span>}
                {!usernameChecking && username.length >= 3 && !usernameError && usernameAvailable === false && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">✕</span>}
              </div>
              {usernameError && <p className="text-red-400 text-sm mt-1">{usernameError}</p>}
              {!usernameError && username.length >= 3 && usernameAvailable === false && <p className="text-red-400 text-sm mt-1">Username already taken</p>}
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-800/80 border border-gray-600 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-netflix-red focus:border-transparent"
                  autoComplete="new-password"
                />
                {passwordValid && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">✓</span>}
              </div>
              <div className="mt-1 flex gap-1">
                <div className="flex-1 h-1.5 bg-gray-700 rounded overflow-hidden">
                  <div className={`h-full transition-all ${strength.level >= 33 ? 'bg-red-500' : ''} ${strength.level >= 66 ? 'bg-yellow-500' : ''} ${strength.level === 100 ? 'bg-green-500' : ''}`} style={{ width: `${strength.level}%` }} />
                </div>
                <span className="text-xs text-gray-400">{strength.label}</span>
              </div>
              {strength.tips.length > 0 && <p className="text-gray-500 text-xs mt-1">Tips: {strength.tips.join(', ')}</p>}
              {passwordError && <p className="text-red-400 text-sm mt-1">{passwordError}</p>}
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Confirm Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-800/80 border border-gray-600 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-netflix-red focus:border-transparent"
                  autoComplete="new-password"
                />
                {confirmValid && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">✓</span>}
              </div>
              {confirmError && <p className="text-red-400 text-sm mt-1">{confirmError}</p>}
            </div>

            <button
              type="submit"
              disabled={!formValid || submitting}
              className="w-full py-3 bg-netflix-red rounded font-semibold text-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
            >
              {submitting && <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              Create Account
            </button>
          </form>
          <p className="text-gray-400 mt-6 text-center">
            Already have an account? <Link to="/login" className="text-netflix-red hover:underline">Sign In</Link>
          </p>
        </motion.div>
      </main>
    </div>
  );
}
