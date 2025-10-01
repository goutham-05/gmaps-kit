import { useState, useCallback } from 'react';

export interface ElevationRequest {
  locations: google.maps.LatLngLiteral[] | google.maps.LatLng[];
  path?: google.maps.LatLngLiteral[] | google.maps.LatLng[];
  samples?: number;
}

export interface ElevationResult {
  elevation: number;
  resolution: number;
  location: google.maps.LatLngLiteral;
}

export interface UseElevationReturn {
  isLoading: boolean;
  error: Error | null;
  results: ElevationResult[] | null;
  getElevationForLocations: (
    request: ElevationRequest
  ) => Promise<ElevationResult[]>;
  getElevationAlongPath: (
    request: ElevationRequest
  ) => Promise<ElevationResult[]>;
  createElevationService: () => google.maps.ElevationService;
}

export function useElevation(): UseElevationReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [results, setResults] = useState<ElevationResult[] | null>(null);

  const handleAsyncOperation = useCallback(
    async <T>(operation: () => Promise<T>): Promise<T> => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await operation();
        return data;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error('Elevation operation failed');
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const getElevationForLocations = useCallback(
    async (request: ElevationRequest): Promise<ElevationResult[]> => {
      return handleAsyncOperation(async () => {
        const elevationService = new google.maps.ElevationService();

        const elevationRequest: google.maps.LocationElevationRequest = {
          locations: request.locations,
        };

        const results = await new Promise<google.maps.ElevationResult[]>(
          (resolve, reject) => {
            elevationService.getElevationForLocations(
              elevationRequest,
              (results, status) => {
                if (status === google.maps.ElevationStatus.OK && results) {
                  resolve(results);
                } else {
                  reject(new Error(`Elevation request failed: ${status}`));
                }
              }
            );
          }
        );

        const elevationResults: ElevationResult[] = results.map((result) => ({
          elevation: result.elevation,
          resolution: result.resolution,
          location: {
            lat: result.location?.lat() || 0,
            lng: result.location?.lng() || 0,
          },
        }));

        setResults(elevationResults);
        return elevationResults;
      });
    },
    [handleAsyncOperation]
  );

  const getElevationAlongPath = useCallback(
    async (request: ElevationRequest): Promise<ElevationResult[]> => {
      return handleAsyncOperation(async () => {
        if (!request.path) {
          throw new Error('Path is required for elevation along path');
        }

        const elevationService = new google.maps.ElevationService();

        const elevationRequest: google.maps.PathElevationRequest = {
          path: request.path,
          samples: request.samples || 256,
        };

        const results = await new Promise<google.maps.ElevationResult[]>(
          (resolve, reject) => {
            elevationService.getElevationAlongPath(
              elevationRequest,
              (results, status) => {
                if (status === google.maps.ElevationStatus.OK && results) {
                  resolve(results);
                } else {
                  reject(new Error(`Elevation request failed: ${status}`));
                }
              }
            );
          }
        );

        const elevationResults: ElevationResult[] = results.map((result) => ({
          elevation: result.elevation,
          resolution: result.resolution,
          location: {
            lat: result.location?.lat() || 0,
            lng: result.location?.lng() || 0,
          },
        }));

        setResults(elevationResults);
        return elevationResults;
      });
    },
    [handleAsyncOperation]
  );

  const createElevationService =
    useCallback((): google.maps.ElevationService => {
      return new google.maps.ElevationService();
    }, []);

  return {
    isLoading,
    error,
    results,
    getElevationForLocations,
    getElevationAlongPath,
    createElevationService,
  };
}
