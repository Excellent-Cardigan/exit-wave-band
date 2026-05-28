import { useState, useEffect } from 'react';
import { kirbyFetch } from '../lib/kirby';

interface KirbyDataState<TData> {
  data: TData | null;
  loading: boolean;
  error: string | null;
}

export function useKirbyData<TData>(endpoint: string): KirbyDataState<TData> {
  const [data, setData] = useState<TData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const result = await kirbyFetch<TData>(endpoint);
        if (isMounted) {
          setData(result);
        }
      } catch (fetchError) {
        if (isMounted) {
          setError(fetchError instanceof Error ? fetchError.message : 'Unknown error');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [endpoint]);

  return { data, loading, error };
}
