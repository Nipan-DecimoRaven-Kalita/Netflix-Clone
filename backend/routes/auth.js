import express from 'express';
import jwt from 'jsonwebtoken';
import { body, query, validationResult } from 'express-validator';
import User from '../models/User.js';
import { authGuard } from '../middleware/auth.js';
import { authLimiter, loginLimiter } from '../middleware/rateLimit.js';

const router = express.Router();
const COOLDOWN_MS = 30 * 1000;
const MAX_FAILED = 3;
const failedAttempts = new Map();

function getCooldownRemaining(identifier) {
  const entry = failedAttempts.get(identifier);
  if (!entry || !entry.lockedUntil) return 0;
  const remaining = entry.lockedUntil - Date.now();
  return remaining > 0 ? Math.ceil(remaining / 1000) : 0;
}

const registerValidation = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters').matches(/^[a-zA-Z\s]+$/).withMessage('Name must contain only letters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('username').trim().isLength({ min: 3, max: 20 }).withMessage('Username 3-20 characters').matches(/^\S+$/).withMessage('No spaces allowed'),
  body('password').isLength({ min: 8 }).withMessage('Password must be 8+ characters').matches(/(?=.*[A-Z])/).withMessage('At least one uppercase').matches(/(?=.*[0-9])/).withMessage('At least one number').matches(/(?=.*[!@#$%^&*(),.?":{}|<>])/).withMessage('At least one special character'),
  body('confirmPassword').custom((val, { req }) => val === req.body.password).withMessage('Passwords must match'),
];

router.post('/register', authLimiter, registerValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg, errors: errors.array() });
    }
    const { name, email, username, password } = req.body;
    const existingEmail = await User.findOne({ email });
    if (existingEmail) return res.status(400).json({ success: false, message: 'Email already registered' });
    const existingUsername = await User.findOne({ username });
    if (existingUsername) return res.status(400).json({ success: false, message: 'Username already taken' });
    const user = await User.create({ name, email, username, password });
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );
    const refreshToken = jwt.sign(
      { userId: user._id, type: 'refresh' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.status(201).json({
      success: true,
      token,
      refreshToken,
      expiresIn: 24 * 60 * 60,
      user: { id: user._id, name: user.name, email: user.email, username: user.username },
    });
  } catch (err) {
    const isDbError = err.name === 'MongooseServerSelectionError' || err.message?.includes('MongoNetworkError') || err.message?.includes('connect');
    res.status(500).json({
      success: false,
      message: isDbError
        ? 'Database not connected. Add a valid MONGO_URI to backend/.env and restart the backend.'
        : (err.message || 'Registration failed'),
    });
  }
});

router.post('/login', authLimiter, loginLimiter, [
  body('identifier').trim().notEmpty().withMessage('Username or email required'),
  body('password').notEmpty().withMessage('Password required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }
    const { identifier, password } = req.body;
    const key = identifier.toLowerCase();
    const remaining = getCooldownRemaining(key);
    if (remaining > 0) {
      return res.status(429).json({
        success: false,
        message: `Too many failed attempts. Try again in ${remaining} seconds.`,
        cooldownSeconds: remaining,
      });
    }
    const user = await User.findOne({
      $or: [{ email: key }, { username: new RegExp(`^${identifier.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }],
    }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      const entry = failedAttempts.get(key) || { count: 0 };
      entry.count += 1;
      if (entry.count >= MAX_FAILED) {
        entry.lockedUntil = Date.now() + COOLDOWN_MS;
        entry.count = 0;
      }
      failedAttempts.set(key, entry);
      return res.status(401).json({ success: false, message: 'Invalid username/email or password' });
    }
    failedAttempts.delete(key);
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );
    const refreshToken = jwt.sign(
      { userId: user._id, type: 'refresh' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({
      success: true,
      token,
      refreshToken,
      expiresIn: 24 * 60 * 60,
      user: { id: user._id, name: user.name, email: user.email, username: user.username },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Login failed' });
  }
});

router.get('/me', authGuard, (req, res) => {
  res.json({ success: true, user: req.user });
});

router.get('/check/email', authLimiter, [
  query('email').isEmail().normalizeEmail(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.json({ available: false });
  const existing = await User.findOne({ email: req.query.email });
  res.json({ available: !existing });
});

router.get('/check/username', authLimiter, [
  query('username').trim().isLength({ min: 3, max: 20 }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.json({ available: false });
  const existing = await User.findOne({ username: new RegExp(`^${req.query.username.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') });
  res.json({ available: !existing });
});

export default router;
