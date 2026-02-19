import express from 'express';
import { query, param, validationResult } from 'express-validator';
import { authGuard } from '../middleware/auth.js';

const router = express.Router();
const OMDB_BASE = process.env.OMDB_BASE_URL || 'https://www.omdbapi.com/';
const API_KEY = process.env.OMDB_API_KEY || '278e1ea3';

function buildUrl(params) {
  const url = new URL(OMDB_BASE);
  url.searchParams.set('apikey', API_KEY);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
  return url.toString();
}

router.get('/trending', authGuard, [
  query('page').optional().isInt({ min: 1, max: 10 }).toInt(),
], async (req, res) => {
  try {
    const page = req.query.page || 1;
    const url = buildUrl({ s: 'the', type: 'movie', page });
    const resp = await fetch(url);
    const data = await resp.json();
    if (data.Response === 'False') {
      return res.json({ success: true, movies: [], total: 0 });
    }
    res.json({ success: true, movies: data.Search || [], total: parseInt(data.totalResults, 10) || 0 });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch trending' });
  }
});

router.get('/list', authGuard, [
  query('s').trim().notEmpty().withMessage('Search term required'),
  query('page').optional().isInt({ min: 1, max: 10 }).toInt(),
  query('y').optional().trim(),
  query('type').optional().isIn(['movie', 'series', 'episode']),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, message: errors.array()[0]?.msg });
    const page = req.query.page || 1;
    const params = { s: req.query.s, page };
    if (req.query.y) params.y = req.query.y;
    if (req.query.type) params.type = req.query.type;
    const url = buildUrl(params);
    const resp = await fetch(url);
    const data = await resp.json();
    if (data.Response === 'False') {
      return res.json({ success: true, movies: [], total: 0 });
    }
    res.json({ success: true, movies: data.Search || [], total: parseInt(data.totalResults, 10) || 0 });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch list' });
  }
});

router.get('/search', authGuard, [
  query('q').trim().notEmpty().withMessage('Query required'),
  query('page').optional().isInt({ min: 1 }).toInt(),
], async (req, res) => {
  try {
    const q = req.query.q?.trim() || '';
    const page = req.query.page || 1;
    const url = buildUrl({ s: q, page });
    const resp = await fetch(url);
    const data = await resp.json();
    if (data.Response === 'False') {
      return res.json({ success: true, movies: [], total: 0 });
    }
    res.json({ success: true, movies: data.Search || [], total: parseInt(data.totalResults, 10) || 0 });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Search failed' });
  }
});

router.get('/:id', authGuard, [
  param('id').trim().notEmpty(),
], async (req, res) => {
  try {
    const id = req.params.id.startsWith('tt') ? req.params.id : `tt${req.params.id}`;
    const url = buildUrl({ i: id, plot: 'full' });
    const resp = await fetch(url);
    const data = await resp.json();
    if (data.Response === 'False') {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }
    res.json({ success: true, movie: data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch movie' });
  }
});

export default router;
