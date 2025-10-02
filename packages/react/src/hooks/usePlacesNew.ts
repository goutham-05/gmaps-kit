import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type {
  PlacesNewClientOptions,
  PlacesNewTextSearchRequest,
  PlacesNewTextSearchResponse,
  PlacesNewNearbySearchRequest,
  PlacesNewNearbySearchResponse,
  PlacesNewPlaceDetailsRequest,
  PlacesNewPlaceDetailsResponse,
  PlacesNewAutocompleteRequest,
  PlacesNewAutocompleteResponse,
  PlacesNewPhotoRequest,
  PlacesNewPhotoResponse,
} from '@gmaps-kit/core';
import { PlacesNewClient } from '@gmaps-kit/core';
import type { PlacesNewApiError } from '@gmaps-kit/core';

type PlacesNewOperationName =
  | 'textSearch'
  | 'nearbySearch'
  | 'placeDetails'
  | 'autocomplete'
  | 'getPhoto';

export interface UsePlacesNewOptions extends PlacesNewClientOptions {}

interface PlacesNewHookState {
  isLoading: boolean;
  lastOperation: PlacesNewOperationName | null;
  error: Error | null;
}

export interface UsePlacesNewReturn {
  client: PlacesNewClient;
  isLoading: boolean;
  error: Error | null;
  lastOperation: PlacesNewOperationName | null;
  textSearch: (
    request: PlacesNewTextSearchRequest
  ) => Promise<PlacesNewTextSearchResponse>;
  nearbySearch: (
    request: PlacesNewNearbySearchRequest
  ) => Promise<PlacesNewNearbySearchResponse>;
  placeDetails: (
    request: PlacesNewPlaceDetailsRequest
  ) => Promise<PlacesNewPlaceDetailsResponse>;
  autocomplete: (
    request: PlacesNewAutocompleteRequest
  ) => Promise<PlacesNewAutocompleteResponse>;
  getPhoto: (request: PlacesNewPhotoRequest) => Promise<PlacesNewPhotoResponse>;
  buildPhotoUrl: (
    photoName: string,
    options?: { maxWidthPx?: number; maxHeightPx?: number }
  ) => string;
}

/**
 * React hook that exposes a typed interface for the Google Places API (New).
 * This hook provides better CORS support and modern API features compared to the legacy Places API.
 * Consumers provide an API key and optionally a custom fetch implementation for server-side usage.
 */
export function usePlacesNew(options: UsePlacesNewOptions): UsePlacesNewReturn {
  const { apiKey, baseUrl, fetchImpl, languageCode, regionCode, requestInit } =
    options;

  const client = useMemo(
    () =>
      new PlacesNewClient({
        apiKey,
        baseUrl,
        fetchImpl,
        languageCode,
        regionCode,
        requestInit,
      }),
    [apiKey, baseUrl, fetchImpl, languageCode, regionCode, requestInit]
  );

  const isMountedRef = useRef(true);
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const [state, setState] = useState<PlacesNewHookState>({
    isLoading: false,
    lastOperation: null,
    error: null,
  });

  const pendingCountRef = useRef(0);

  const runWithState = useCallback(
    async <T>(
      operation: PlacesNewOperationName,
      executor: () => Promise<T>
    ): Promise<T> => {
      pendingCountRef.current += 1;
      if (isMountedRef.current) {
        setState((previous) => ({
          isLoading: true,
          lastOperation: previous.lastOperation,
          error: null,
        }));
      }

      let capturedError: Error | null = null;

      try {
        return await executor();
      } catch (error) {
        capturedError = error as Error;
        throw error;
      } finally {
        pendingCountRef.current = Math.max(0, pendingCountRef.current - 1);
        if (isMountedRef.current) {
          setState({
            isLoading: pendingCountRef.current > 0,
            lastOperation: operation,
            error: capturedError,
          });
        }
      }
    },
    []
  );

  const textSearch = useCallback(
    (request: PlacesNewTextSearchRequest) =>
      runWithState('textSearch', () => client.textSearch(request)),
    [client, runWithState]
  );

  const nearbySearch = useCallback(
    (request: PlacesNewNearbySearchRequest) =>
      runWithState('nearbySearch', () => client.nearbySearch(request)),
    [client, runWithState]
  );

  const placeDetails = useCallback(
    (request: PlacesNewPlaceDetailsRequest) =>
      runWithState('placeDetails', () => client.placeDetails(request)),
    [client, runWithState]
  );

  const autocomplete = useCallback(
    (request: PlacesNewAutocompleteRequest) =>
      runWithState('autocomplete', () => client.autocomplete(request)),
    [client, runWithState]
  );

  const getPhoto = useCallback(
    (request: PlacesNewPhotoRequest) =>
      runWithState('getPhoto', () => client.getPhoto(request)),
    [client, runWithState]
  );

  const buildPhotoUrl = useCallback<UsePlacesNewReturn['buildPhotoUrl']>(
    (photoName, photoOptions) => client.buildPhotoUrl(photoName, photoOptions),
    [client]
  );

  return {
    client,
    isLoading: state.isLoading,
    error: state.error,
    lastOperation: state.lastOperation,
    textSearch,
    nearbySearch,
    placeDetails,
    autocomplete,
    getPhoto,
    buildPhotoUrl,
  };
}

export type PlacesNewHookError = PlacesNewApiError;
