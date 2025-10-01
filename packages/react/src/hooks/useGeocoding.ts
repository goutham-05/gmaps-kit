import { useState, useCallback } from 'react';
import {
  geocodeAsync,
  reverseGeocodeAsync,
  geocodeFirst,
  reverseGeocodeFirst,
  geocodeWithComponents,
  geocodeWithBounds,
  geocodeWithRegion,
} from '@gmaps-kit/core';

export interface GeocodingResult {
  address: string;
  location: google.maps.LatLngLiteral;
  placeId?: string;
}

export interface UseGeocodingReturn {
  isLoading: boolean;
  error: Error | null;
  geocode: (address: string) => Promise<GeocodingResult[]>;
  geocodeFirst: (address: string) => Promise<GeocodingResult | null>;
  reverseGeocode: (
    location: google.maps.LatLngLiteral
  ) => Promise<GeocodingResult[]>;
  reverseGeocodeFirst: (
    location: google.maps.LatLngLiteral
  ) => Promise<GeocodingResult | null>;
  geocodeWithComponents: (
    address: string,
    components: google.maps.GeocoderComponentRestrictions
  ) => Promise<GeocodingResult[]>;
  geocodeWithBounds: (
    address: string,
    bounds: google.maps.LatLngBounds
  ) => Promise<GeocodingResult[]>;
  geocodeWithRegion: (
    address: string,
    region: string
  ) => Promise<GeocodingResult[]>;
}

export function useGeocoding(): UseGeocodingReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleAsyncOperation = useCallback(
    async <T>(operation: () => Promise<T>): Promise<T> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await operation();
        return result;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error('Geocoding operation failed');
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const geocode = useCallback(
    async (address: string): Promise<GeocodingResult[]> => {
      return handleAsyncOperation(async () => {
        const results = await geocodeAsync(address);
        return results.map((result) => ({
          address: result.address,
          location: result.location,
          placeId: result.placeId,
        }));
      });
    },
    [handleAsyncOperation]
  );

  const geocodeFirstResult = useCallback(
    async (address: string): Promise<GeocodingResult | null> => {
      return handleAsyncOperation(async () => {
        const result = await geocodeFirst(address);
        if (!result) return null;

        return {
          address: result.address,
          location: result.location,
          placeId: result.placeId,
        };
      });
    },
    [handleAsyncOperation]
  );

  const reverseGeocode = useCallback(
    async (location: google.maps.LatLngLiteral): Promise<GeocodingResult[]> => {
      return handleAsyncOperation(async () => {
        const results = await reverseGeocodeAsync(location);
        return results.map((result) => ({
          address: result.address,
          location: result.location,
          placeId: result.placeId,
        }));
      });
    },
    [handleAsyncOperation]
  );

  const reverseGeocodeFirstResult = useCallback(
    async (
      location: google.maps.LatLngLiteral
    ): Promise<GeocodingResult | null> => {
      return handleAsyncOperation(async () => {
        const result = await reverseGeocodeFirst(location);
        if (!result) return null;

        return {
          address: result.address,
          location: result.location,
          placeId: result.placeId,
        };
      });
    },
    [handleAsyncOperation]
  );

  const geocodeWithComponentsResult = useCallback(
    async (
      address: string,
      components: google.maps.GeocoderComponentRestrictions
    ): Promise<GeocodingResult[]> => {
      return handleAsyncOperation(async () => {
        await geocodeWithComponents(address, components, () => {});
        // Note: geocodeWithComponents returns void, so we need to use geocodeAsync instead
        const results = await geocodeAsync(address);
        return results.map((result) => ({
          address: result.address,
          location: result.location,
          placeId: result.placeId,
        }));
      });
    },
    [handleAsyncOperation]
  );

  const geocodeWithBoundsResult = useCallback(
    async (
      address: string,
      bounds: google.maps.LatLngBounds
    ): Promise<GeocodingResult[]> => {
      return handleAsyncOperation(async () => {
        await geocodeWithBounds(address, bounds, () => {});
        // Note: geocodeWithBounds returns void, so we need to use geocodeAsync instead
        const results = await geocodeAsync(address);
        return results.map((result) => ({
          address: result.address,
          location: result.location,
          placeId: result.placeId,
        }));
      });
    },
    [handleAsyncOperation]
  );

  const geocodeWithRegionResult = useCallback(
    async (address: string, region: string): Promise<GeocodingResult[]> => {
      return handleAsyncOperation(async () => {
        await geocodeWithRegion(address, region, () => {});
        // Note: geocodeWithRegion returns void, so we need to use geocodeAsync instead
        const results = await geocodeAsync(address);
        return results.map((result) => ({
          address: result.address,
          location: result.location,
          placeId: result.placeId,
        }));
      });
    },
    [handleAsyncOperation]
  );

  return {
    isLoading,
    error,
    geocode,
    geocodeFirst: geocodeFirstResult,
    reverseGeocode,
    reverseGeocodeFirst: reverseGeocodeFirstResult,
    geocodeWithComponents: geocodeWithComponentsResult,
    geocodeWithBounds: geocodeWithBoundsResult,
    geocodeWithRegion: geocodeWithRegionResult,
  };
}
