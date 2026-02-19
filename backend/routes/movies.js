import express from 'express';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
const OMDB_API_KEY = process.env.OMDB_API_KEY;
const OMDB_BASE = 'https://www.omdbapi.com/';

const GENRES = ['Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Drama', 'Horror', 'Sci-Fi'];

const cache = new Map();
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

async function fetchOMDb(search, type = 'movie') {
  const key = `${search}-${type}`;
  const cached = cache.get(key);
  if (cached && Date.now() - cached.ts < CACHE_TTL) return cached.data;

  const url = `${OMDB_BASE}?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(search)}&type=${type}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.Response === 'True') {
    cache.set(key, { data, ts: Date.now() });
  }
  return data;
}

async function fetchOMDbById(id) {
  const key = `id-${id}`;
  const cached = cache.get(key);
  if (cached && Date.now() - cached.ts < CACHE_TTL) return cached.data;

  const url = `${OMDB_BASE}?apikey=${OMDB_API_KEY}&i=${encodeURIComponent(id)}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.Response === 'True') {
    cache.set(key, { data, ts: Date.now() });
  }
  return data;
}

router.get('/genres', authMiddleware, async (req, res) => {
  try {
    if (!OMDB_API_KEY) {
      return res.status(500).json({ error: 'OMDb API key not configured' });
    }

    const results = {};
    for (const genre of GENRES) {
      const data = await fetchOMDb(genre);
      if (data?.Search) {
        results[genre] = data.Search.map((m) => ({
          imdbID: m.imdbID,
          Title: m.Title,
          Year: m.Year,
          Poster: m.Poster,
          Type: m.Type,
        }));
      } else {
        results[genre] = [];
      }
    }

    res.json(results);
  } catch (err) {
    console.error('Movies error:', err);
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
});

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const data = await fetchOMDbById(id);
    if (!data || data.Response === 'False') {
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.json({
      imdbID: data.imdbID,
      Title: data.Title,
      Year: data.Year,
      Poster: data.Poster,
      imdbRating: data.imdbRating,
      Plot: data.Plot,
      Genre: data.Genre,
      Runtime: data.Runtime,
      Director: data.Director,
      Actors: data.Actors,
    });
  } catch (err) {
    console.error('Movie detail error:', err);
    res.status(500).json({ error: 'Failed to fetch movie' });
  }
});

export default router;
