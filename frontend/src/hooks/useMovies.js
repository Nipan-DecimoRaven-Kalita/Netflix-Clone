import { useState, useEffect, useCallback } from 'react';
import { MOVIES } from '../lib/api';

export function useMovies() {
  const [trending, setTrending] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [action, setAction] = useState([]);
  const [latest2025, setLatest2025] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRow = useCallback(async (setter, fn) => {
    try {
      const data = await fn();
      setter(data.movies || []);
    } catch (e) {
      setter([]);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    Promise.all([
      fetchRow(setTrending, () => MOVIES.trending(1)),
      fetchRow(setTopRated, () => MOVIES.list({ s: 'love', type: 'movie', page: 1 })),
      fetchRow(setAction, () => MOVIES.list({ s: 'action', type: 'movie', page: 1 })),
      fetchRow(setLatest2025, () => MOVIES.list({ s: 'the', y: '2025', type: 'movie', page: 1 })),
    ]).then(() => {
      if (!cancelled) setLoading(false);
    }).catch((e) => {
      if (!cancelled) {
        setError(e.message);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [fetchRow]);

  return {
    trending,
    topRated,
    action,
    latest2025,
    loading,
    error,
  };
}

export function useSearch(query) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!query.trim()) {
      setMovies([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    MOVIES.search(query, 1)
      .then((data) => {
        if (!cancelled) setMovies(data.movies || []);
      })
      .catch(() => { if (!cancelled) setMovies([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [query]);
  return { movies, loading };
}
