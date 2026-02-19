import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getDbConnection } from '../config/db.js';
import { validateRegister, validateLogin, sanitize } from '../utils/validation.js';
import { loginRateLimiter } from '../middleware/rateLimit.js';

const router = express.Router();
const SALT_ROUNDS = 12;

router.post('/register', async (req, res) => {
  try {
    const { username, email, name, password } = req.body;
    const validation = validateRegister({ username, email, name, password });
    if (!validation.valid) {
      return res.status(400).json({ errors: validation.errors });
    }

    const pool = await getDbConnection();
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    await pool.execute(
      'INSERT INTO users (username, email, name, password_hash) VALUES (?, ?, ?, ?)',
      [validation.data.username, validation.data.email, validation.data.name, passwordHash]
    );

    const [rows] = await pool.execute('SELECT id, username, email, name FROM users WHERE email = ?', [
      validation.data.email,
    ]);
    const user = rows[0];

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY || '24h' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      user: { id: user.id, username: user.username, email: user.email, name: user.name },
      token,
      refreshToken,
      expiresIn: 86400,
    });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ errors: ['Email or username already exists'] });
    }
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', loginRateLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    const validation = validateLogin({ email, password });
    if (!validation.valid) {
      return res.status(400).json({ errors: validation.errors });
    }

    const pool = await getDbConnection();
    const [rows] = await pool.execute(
      'SELECT id, username, email, name, password_hash FROM users WHERE email = ?',
      [validation.data.email]
    );

    const user = rows[0];
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ errors: ['Invalid email or password'] });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY || '24h' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      user: { id: user.id, username: user.username, email: user.email, name: user.name },
      token,
      refreshToken,
      expiresIn: 86400,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.clearCookie('refreshToken');
  res.json({ success: true });
});

router.post('/refresh', async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const pool = await getDbConnection();
    const [rows] = await pool.execute('SELECT id, username, email, name FROM users WHERE id = ?', [
      decoded.userId,
    ]);
    const user = rows[0];
    if (!user) return res.status(401).json({ error: 'User not found' });

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY || '24h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      user: { id: user.id, username: user.username, email: user.email, name: user.name },
      token,
      expiresIn: 86400,
    });
  } catch (err) {
    res.clearCookie('token');
    res.clearCookie('refreshToken');
    return res.status(401).json({ error: 'Invalid refresh token' });
  }
});

export default router;
