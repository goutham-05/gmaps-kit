import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type {
  GeocodingClientOptions,
  GeocodeRequest,
  ReverseGeocodeRequest,
  GeocodingResponse,
} from '@gmaps-kit/core';
import { GeocodingClient } from '@gmaps-kit/core';
import type { GeocodingApiError } from '@gmaps-kit/core';

type GeocodingOperation = 'geocode' | 'reverseGeocode';

export interface UseGeocodingServiceOptions extends GeocodingClientOptions {}

interface GeocodingServiceState {
  isLoading: boolean;
  lastOperation: GeocodingOperation | null;
  error: Error | null;
}

export interface UseGeocodingServiceReturn {
  client: GeocodingClient;
  isLoading: boolean;
  error: Error | null;
  lastOperation: GeocodingOperation | null;
  geocode: (request: GeocodeRequest) => Promise<GeocodingResponse>;
  reverseGeocode: (
    request: ReverseGeocodeRequest
  ) => Promise<GeocodingResponse>;
}

export function useGeocodingService(
  options: UseGeocodingServiceOptions
): UseGeocodingServiceReturn {
  const {
    apiKey,
    baseUrl,
    fetchImpl,
    language,
    region,
    channel,
    timeoutMs,
    requestInit,
    retryConfig,
  } = options;

  const client = useMemo(
    () =>
      new GeocodingClient({
        apiKey,
        baseUrl,
        fetchImpl,
        language,
        region,
        channel,
        timeoutMs,
        requestInit,
        retryConfig,
      }),
    [
      apiKey,
      baseUrl,
      fetchImpl,
      language,
      region,
      channel,
      timeoutMs,
      requestInit,
      retryConfig?.retries,
      retryConfig?.delayMs,
      retryConfig?.backoffFactor,
      retryConfig?.retryStatuses && retryConfig.retryStatuses.join(','),
    ]
  );

  const isMountedRef = useRef(true);
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const [state, setState] = useState<GeocodingServiceState>({
    isLoading: false,
    lastOperation: null,
    error: null,
  });

  const runWithState = useCallback(
    async (
      operation: GeocodingOperation,
      executor: () => Promise<GeocodingResponse>
    ): Promise<GeocodingResponse> => {
      if (isMountedRef.current) {
        setState({ isLoading: true, lastOperation: operation, error: null });
      }

      try {
        const result = await executor();
        if (isMountedRef.current) {
          setState({ isLoading: false, lastOperation: operation, error: null });
        }
        return result;
      } catch (error) {
        if (isMountedRef.current) {
          setState({
            isLoading: false,
            lastOperation: operation,
            error: error as Error,
          });
        }
        throw error;
      }
    },
    []
  );

  const geocode = useCallback(
    (request: GeocodeRequest) =>
      runWithState('geocode', () => client.geocode(request)),
    [client, runWithState]
  );

  const reverseGeocode = useCallback(
    (request: ReverseGeocodeRequest) =>
      runWithState('reverseGeocode', () => client.reverseGeocode(request)),
    [client, runWithState]
  );

  return {
    client,
    isLoading: state.isLoading,
    error: state.error,
    lastOperation: state.lastOperation,
    geocode,
    reverseGeocode,
  };
}

export type GeocodingServiceHookError = GeocodingApiError;
