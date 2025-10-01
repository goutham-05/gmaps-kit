import { useState, useEffect } from 'react';
import { loadGoogleMaps, isGoogleMapsLoaded } from '@gmaps-kit/core';

export interface UseGoogleMapsOptions {
  apiKey: string;
  libraries?: string[];
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

export interface UseGoogleMapsReturn {
  isLoaded: boolean;
  isLoading: boolean;
  error: Error | null;
  load: () => Promise<void>;
}

export function useGoogleMaps(
  options: UseGoogleMapsOptions
): UseGoogleMapsReturn {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const load = async () => {
    if (isLoaded || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      await loadGoogleMaps({
        apiKey: options.apiKey,
        libraries: options.libraries || ['places', 'geometry'],
      });

      setIsLoaded(true);
      options.onLoad?.();
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error('Failed to load Google Maps');
      setError(error);
      options.onError?.(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isGoogleMapsLoaded()) {
      setIsLoaded(true);
    }
  }, []);

  return {
    isLoaded,
    isLoading,
    error,
    load,
  };
}
