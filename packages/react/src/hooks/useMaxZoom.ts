import { useState, useCallback } from 'react';

export interface MaxZoomRequest {
  location: google.maps.LatLngLiteral;
}

export interface MaxZoomResult {
  maxZoom: number;
  location: google.maps.LatLngLiteral;
}

export interface UseMaxZoomReturn {
  isLoading: boolean;
  error: Error | null;
  result: MaxZoomResult | null;
  getMaxZoom: (request: MaxZoomRequest) => Promise<MaxZoomResult>;
  createMaxZoomService: () => google.maps.MaxZoomService;
}

export function useMaxZoom(): UseMaxZoomReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<MaxZoomResult | null>(null);

  const handleAsyncOperation = useCallback(
    async <T>(operation: () => Promise<T>): Promise<T> => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await operation();
        return data;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error('Max Zoom operation failed');
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const getMaxZoom = useCallback(
    async (request: MaxZoomRequest): Promise<MaxZoomResult> => {
      return handleAsyncOperation(async () => {
        const maxZoomService = new google.maps.MaxZoomService();

        const result = await new Promise<google.maps.MaxZoomResult>(
          (resolve, reject) => {
            maxZoomService.getMaxZoomAtLatLng(
              request.location,
              (result: google.maps.MaxZoomResult) => {
                if (result && result.status === google.maps.MaxZoomStatus.OK) {
                  resolve(result);
                } else {
                  reject(
                    new Error(
                      `Max Zoom request failed: ${result?.status || 'Unknown error'}`
                    )
                  );
                }
              }
            );
          }
        );

        const maxZoomResult: MaxZoomResult = {
          maxZoom: result.zoom,
          location: {
            lat: request.location.lat,
            lng: request.location.lng,
          },
        };

        setResult(maxZoomResult);
        return maxZoomResult;
      });
    },
    [handleAsyncOperation]
  );

  const createMaxZoomService = useCallback((): google.maps.MaxZoomService => {
    return new google.maps.MaxZoomService();
  }, []);

  return {
    isLoading,
    error,
    result,
    getMaxZoom,
    createMaxZoomService,
  };
}
