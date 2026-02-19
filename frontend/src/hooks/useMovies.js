import { useState, useEffect } from 'react';
import api from '../lib/api';

export function useMovies() {
  const [genres, setGenres] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    api
      .get('/movies/genres')
      .then(({ data }) => {
        if (!cancelled) setGenres(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.error || 'Failed to load movies');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => (cancelled = true);
  }, []);

  return { genres, loading, error };
}
