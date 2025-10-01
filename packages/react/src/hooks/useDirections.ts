import { useState, useCallback } from 'react';
import {
  getDirectionsAsync,
  getTotalDistance,
  getTotalDuration,
  getDirectionsBounds,
  fitMapToRoute,
  createDirectionsService,
  createDirectionsRenderer,
  clearDirections,
} from '@gmaps-kit/core';
import { MapInstance } from '@gmaps-kit/core';

export interface DirectionsRequest {
  origin: string | google.maps.LatLngLiteral;
  destination: string | google.maps.LatLngLiteral;
  travelMode?: google.maps.TravelMode;
  waypoints?: google.maps.DirectionsWaypoint[];
  optimizeWaypoints?: boolean;
  avoidHighways?: boolean;
  avoidTolls?: boolean;
  region?: string;
}

export interface DirectionsResult {
  directions: google.maps.DirectionsResult | null;
  distance: number; // in meters
  duration: number; // in seconds
  bounds: google.maps.LatLngBounds | null;
  renderer: google.maps.DirectionsRenderer | null;
}

export interface UseDirectionsReturn {
  isLoading: boolean;
  error: Error | null;
  result: DirectionsResult | null;
  getDirections: (request: DirectionsRequest) => Promise<DirectionsResult>;
  renderDirections: (mapInstance: MapInstance) => void;
  clearDirectionsFromMap: () => void;
  fitMapToRoute: (mapInstance: MapInstance) => void;
}

export function useDirections(): UseDirectionsReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<DirectionsResult | null>(null);

  const handleAsyncOperation = useCallback(
    async <T>(operation: () => Promise<T>): Promise<T> => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await operation();
        return data;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error('Directions operation failed');
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const getDirections = useCallback(
    async (request: DirectionsRequest): Promise<DirectionsResult> => {
      return handleAsyncOperation(async () => {
        // Create a custom request that includes region if provided
        const directionsRequest: google.maps.DirectionsRequest = {
          origin: request.origin,
          destination: request.destination,
          travelMode: request.travelMode || google.maps.TravelMode.DRIVING,
          waypoints: request.waypoints,
          optimizeWaypoints: request.optimizeWaypoints,
          avoidHighways: request.avoidHighways,
          avoidTolls: request.avoidTolls,
          ...(request.region && { region: request.region }),
        };

        // Use the DirectionsService directly to support region parameter
        const directionsService = new google.maps.DirectionsService();
        const directions = await new Promise<google.maps.DirectionsResult>(
          (resolve, reject) => {
            directionsService.route(directionsRequest, (result, status) => {
              if (status === google.maps.DirectionsStatus.OK && result) {
                resolve(result);
              } else {
                reject(new Error(`Directions request failed: ${status}`));
              }
            });
          }
        );

        const distance = getTotalDistance(directions);
        const duration = getTotalDuration(directions);
        const bounds = getDirectionsBounds(directions);
        // Note: renderer will be created when needed with mapInstance
        const renderer = null;

        const directionsResult: DirectionsResult = {
          directions,
          distance,
          duration,
          bounds,
          renderer,
        };

        setResult(directionsResult);
        return directionsResult;
      });
    },
    [handleAsyncOperation]
  );

  const renderDirectionsOnMap = useCallback(
    (mapInstance: MapInstance) => {
      if (!result?.directions) {
        throw new Error('No directions result available');
      }

      const renderer = createDirectionsRenderer(mapInstance);
      renderer.setDirections(result.directions);
    },
    [result]
  );

  const clearDirectionsFromMap = useCallback(() => {
    // Note: This would need to be called with the specific renderer instance
    // For now, this is a placeholder function
    console.log('Clear directions from map - renderer needs to be passed');
  }, []);

  const fitMapToRouteBounds = useCallback(
    (mapInstance: MapInstance) => {
      if (!result?.directions) {
        throw new Error('No directions result available');
      }

      fitMapToRoute(mapInstance.map, result.directions);
    },
    [result]
  );

  return {
    isLoading,
    error,
    result,
    getDirections,
    renderDirections: renderDirectionsOnMap,
    clearDirectionsFromMap,
    fitMapToRoute: fitMapToRouteBounds,
  };
}
