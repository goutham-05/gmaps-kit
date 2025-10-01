import { useState, useCallback } from 'react';
import {
  getDistanceMatrixAsync,
  createDistanceMatrixService,
} from '@gmaps-kit/core';

export interface DistanceMatrixRequest {
  origins: (string | google.maps.LatLngLiteral)[];
  destinations: (string | google.maps.LatLngLiteral)[];
  travelMode?: google.maps.TravelMode;
  avoidHighways?: boolean;
  avoidTolls?: boolean;
  departureTime?: Date;
  trafficModel?: google.maps.TrafficModel;
  transitOptions?: google.maps.TransitOptions;
  unitSystem?: google.maps.UnitSystem;
}

export interface DistanceMatrixElement {
  distance: {
    text: string;
    value: number; // in meters
  };
  duration: {
    text: string;
    value: number; // in seconds
  };
  duration_in_traffic?: {
    text: string;
    value: number; // in seconds
  };
  status: google.maps.DistanceMatrixElementStatus;
}

export interface DistanceMatrixResult {
  elements: DistanceMatrixElement[];
  origins: string[];
  destinations: string[];
  service: google.maps.DistanceMatrixService | null;
}

export interface UseDistanceMatrixReturn {
  isLoading: boolean;
  error: Error | null;
  result: DistanceMatrixResult | null;
  getDistanceMatrix: (
    request: DistanceMatrixRequest
  ) => Promise<DistanceMatrixResult>;
  createService: () => google.maps.DistanceMatrixService;
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
        const matrix = await getDistanceMatrixAsync({
          origins: request.origins,
          destinations: request.destinations,
          travelMode: request.travelMode || google.maps.TravelMode.DRIVING,
          avoidHighways: request.avoidHighways,
          avoidTolls: request.avoidTolls,
          departureTime: request.departureTime,
          trafficModel: request.trafficModel,
          transitOptions: request.transitOptions,
          unitSystem: request.unitSystem,
        });

        const service = createDistanceMatrixService();

        const distanceMatrixResult: DistanceMatrixResult = {
          elements: matrix,
          origins: request.origins.map((origin) =>
            typeof origin === 'string' ? origin : `${origin.lat},${origin.lng}`
          ),
          destinations: request.destinations.map((destination) =>
            typeof destination === 'string'
              ? destination
              : `${destination.lat},${destination.lng}`
          ),
          service,
        };

        setResult(distanceMatrixResult);
        return distanceMatrixResult;
      });
    },
    [handleAsyncOperation]
  );

  const createService = useCallback((): google.maps.DistanceMatrixService => {
    return handleAsyncOperation(() => {
      return createDistanceMatrixService();
    });
  }, [handleAsyncOperation]);

  return {
    isLoading,
    error,
    result,
    getDistanceMatrix,
    createService,
  };
}
