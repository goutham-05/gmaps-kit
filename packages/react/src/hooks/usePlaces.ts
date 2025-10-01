import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type {
  PlacesClientOptions,
  PlacesFindPlaceRequest,
  PlacesFindPlaceResponse,
  PlacesTextSearchRequest,
  PlacesTextSearchResponse,
  PlacesNearbySearchRequest,
  PlacesNearbySearchResponse,
  PlacesDetailsRequest,
  PlacesDetailsResponse,
  PlacesAutocompleteRequest,
  PlacesAutocompleteResponse,
  PlacesQueryAutocompleteRequest,
  PlacesQueryAutocompleteResponse,
  PlacesPhotoOptions,
} from '@gmaps-kit/core';
import { PlacesClient } from '@gmaps-kit/core';
import type { PlacesApiError } from '@gmaps-kit/core';

type PlacesOperationName =
  | 'findPlaceFromText'
  | 'textSearch'
  | 'nearbySearch'
  | 'placeDetails'
  | 'autocomplete'
  | 'queryAutocomplete'
  | 'textSearchNextPage'
  | 'nearbySearchNextPage';

export interface UsePlacesOptions extends PlacesClientOptions {}

interface PlacesHookState {
  isLoading: boolean;
  lastOperation: PlacesOperationName | null;
  error: Error | null;
}

export interface UsePlacesReturn {
  client: PlacesClient;
  isLoading: boolean;
  error: Error | null;
  lastOperation: PlacesOperationName | null;
  findPlaceFromText: (
    request: PlacesFindPlaceRequest
  ) => Promise<PlacesFindPlaceResponse>;
  textSearch: (
    request: PlacesTextSearchRequest
  ) => Promise<PlacesTextSearchResponse>;
  nearbySearch: (
    request: PlacesNearbySearchRequest
  ) => Promise<PlacesNearbySearchResponse>;
  placeDetails: (
    request: PlacesDetailsRequest
  ) => Promise<PlacesDetailsResponse>;
  autocomplete: (
    request: PlacesAutocompleteRequest
  ) => Promise<PlacesAutocompleteResponse>;
  queryAutocomplete: (
    request: PlacesQueryAutocompleteRequest
  ) => Promise<PlacesQueryAutocompleteResponse>;
  textSearchNextPage: (
    pagetoken: string,
    delayMs?: number
  ) => Promise<PlacesTextSearchResponse>;
  nearbySearchNextPage: (
    pagetoken: string,
    delayMs?: number
  ) => Promise<PlacesNearbySearchResponse>;
  buildPhotoUrl: (photoReference: string, options?: PlacesPhotoOptions) => string;
}

/**
 * React hook that exposes a typed interface for the Google Places Web Service.
 * Consumers provide an API key and optionally a custom fetch implementation for server-side usage.
 */
export function usePlaces(options: UsePlacesOptions): UsePlacesReturn {
  const { apiKey, baseUrl, fetchImpl, language, region, requestInit } = options;

  const client = useMemo(
    () =>
      new PlacesClient({
        apiKey,
        baseUrl,
        fetchImpl,
        language,
        region,
        requestInit,
      }),
    [apiKey, baseUrl, fetchImpl, language, region, requestInit]
  );

  const isMountedRef = useRef(true);
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const [state, setState] = useState<PlacesHookState>({
    isLoading: false,
    lastOperation: null,
    error: null,
  });

  const pendingCountRef = useRef(0);

  const runWithState = useCallback(
    async <T>(operation: PlacesOperationName, executor: () => Promise<T>): Promise<T> => {
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

  const findPlaceFromText = useCallback(
    (request: PlacesFindPlaceRequest) =>
      runWithState('findPlaceFromText', () => client.findPlaceFromText(request)),
    [client, runWithState]
  );

  const textSearch = useCallback(
    (request: PlacesTextSearchRequest) =>
      runWithState('textSearch', () => client.textSearch(request)),
    [client, runWithState]
  );

  const nearbySearch = useCallback(
    (request: PlacesNearbySearchRequest) =>
      runWithState('nearbySearch', () => client.nearbySearch(request)),
    [client, runWithState]
  );

  const placeDetails = useCallback(
    (request: PlacesDetailsRequest) =>
      runWithState('placeDetails', () => client.placeDetails(request)),
    [client, runWithState]
  );

  const autocomplete = useCallback(
    (request: PlacesAutocompleteRequest) =>
      runWithState('autocomplete', () => client.autocomplete(request)),
    [client, runWithState]
  );

  const queryAutocomplete = useCallback(
    (request: PlacesQueryAutocompleteRequest) =>
      runWithState('queryAutocomplete', () => client.queryAutocomplete(request)),
    [client, runWithState]
  );

  const textSearchNextPage = useCallback(
    (pagetoken: string, delayMs?: number) =>
      runWithState('textSearchNextPage', () =>
        client.textSearchNextPage(pagetoken, delayMs)
      ),
    [client, runWithState]
  );

  const nearbySearchNextPage = useCallback(
    (pagetoken: string, delayMs?: number) =>
      runWithState('nearbySearchNextPage', () =>
        client.nearbySearchNextPage(pagetoken, delayMs)
      ),
    [client, runWithState]
  );

  const buildPhotoUrl = useCallback<UsePlacesReturn['buildPhotoUrl']>(
    (photoReference, photoOptions) => client.buildPhotoUrl(photoReference, photoOptions),
    [client]
  );

  return {
    client,
    isLoading: state.isLoading,
    error: state.error,
    lastOperation: state.lastOperation,
    findPlaceFromText,
    textSearch,
    nearbySearch,
    placeDetails,
    autocomplete,
    queryAutocomplete,
    textSearchNextPage,
    nearbySearchNextPage,
    buildPhotoUrl,
  };
}

export type PlacesHookError = PlacesApiError;
