import { useState, useCallback } from 'react';
import {
  getDistanceMatrixAsync,
  createDistanceMatrixService,
  DistanceMatrixOptions,
  DistanceMatrixResult as CoreDistanceMatrixResult,
  MapInstance,
} from '@gmaps-kit/core';

export interface DistanceMatrixRequest extends DistanceMatrixOptions {
  // Extended interface for React hook
}

export interface DistanceMatrixResult {
  results: CoreDistanceMatrixResult[];
  origins: (string | google.maps.LatLngLiteral)[];
  destinations: (string | google.maps.LatLngLiteral)[];
  service: google.maps.DistanceMatrixService | null;
}

export interface UseDistanceMatrixReturn {
  isLoading: boolean;
  error: Error | null;
  result: DistanceMatrixResult | null;
  getDistanceMatrix: (
    request: DistanceMatrixRequest
  ) => Promise<DistanceMatrixResult>;
  createService: (
    mapInstance: MapInstance
  ) => google.maps.DistanceMatrixService;
}

export function useDistanceMatrix(): UseDistanceMatrixReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<DistanceMatrixResult | null>(null);

  const handleAsyncOperation = useCallback(
    async <T>(operation: () => Promise<T>): Promise<T> => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await operation();
        return data;
      } catch (err) {
        const error =
          err instanceof Error
            ? err
            : new Error('Distance matrix operation failed');
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const getDistanceMatrix = useCallback(
    async (request: DistanceMatrixRequest): Promise<DistanceMatrixResult> => {
      return handleAsyncOperation(async () => {
        const results = await getDistanceMatrixAsync({
          origins: request.origins,
          destinations: request.destinations,
          travelMode: request.travelMode,
          avoidHighways: request.avoidHighways,
          avoidTolls: request.avoidTolls,
          unitSystem: request.unitSystem,
        });

        const distanceMatrixResult: DistanceMatrixResult = {
          results,
          origins: request.origins,
          destinations: request.destinations,
          service: null,
        };

        setResult(distanceMatrixResult);
        return distanceMatrixResult;
      });
    },
    [handleAsyncOperation]
  );

  const createService = useCallback(
    (mapInstance: MapInstance): google.maps.DistanceMatrixService => {
      return createDistanceMatrixService(mapInstance);
    },
    []
  );

  return {
    isLoading,
    error,
    result,
    getDistanceMatrix,
    createService,
  };
}
