import { useState, useCallback, useEffect } from 'react';

export interface StreetViewRequest {
  location?: google.maps.LatLngLiteral;
  pano?: string;
  radius?: number;
  source?: google.maps.StreetViewSource;
}

export interface StreetViewPanoramaData {
  location: google.maps.StreetViewLocation;
  links: google.maps.StreetViewLink[];
  copyright: string;
  tiles: {
    worldSize: google.maps.Size;
    tileSize: google.maps.Size;
    centerHeading: number;
  };
}

export interface UseStreetViewReturn {
  isLoading: boolean;
  error: Error | null;
  panoramaData: StreetViewPanoramaData | null;
  getPanorama: (request: StreetViewRequest) => Promise<StreetViewPanoramaData>;
  createPanorama: (
    container: string | HTMLElement,
    options?: google.maps.StreetViewPanoramaOptions
  ) => google.maps.StreetViewPanorama;
  getPanoramaByLocation: (
    location: google.maps.LatLngLiteral,
    radius?: number
  ) => Promise<StreetViewPanoramaData>;
  getPanoramaById: (panoId: string) => Promise<StreetViewPanoramaData>;
}

export function useStreetView(): UseStreetViewReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [panoramaData, setPanoramaData] =
    useState<StreetViewPanoramaData | null>(null);

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
            : new Error('Street View operation failed');
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const getPanorama = useCallback(
    async (request: StreetViewRequest): Promise<StreetViewPanoramaData> => {
      return handleAsyncOperation(async () => {
        const streetViewService = new google.maps.StreetViewService();

        const panoramaRequest: google.maps.StreetViewPanoramaRequest = {
          location: request.location,
          pano: request.pano,
          radius: request.radius,
          source: request.source,
        };

        const result = await new Promise<google.maps.StreetViewPanoramaData>(
          (resolve, reject) => {
            streetViewService.getPanorama(panoramaRequest, (data, status) => {
              if (status === google.maps.StreetViewStatus.OK && data) {
                resolve(data);
              } else {
                reject(new Error(`Street View request failed: ${status}`));
              }
            });
          }
        );

        const streetViewData: StreetViewPanoramaData = {
          location: result.location,
          links: result.links,
          copyright: result.copyright,
          tiles: result.tiles,
        };

        setPanoramaData(streetViewData);
        return streetViewData;
      });
    },
    [handleAsyncOperation]
  );

  const createPanorama = useCallback(
    (
      container: string | HTMLElement,
      options?: google.maps.StreetViewPanoramaOptions
    ): google.maps.StreetViewPanorama => {
      const panoramaOptions: google.maps.StreetViewPanoramaOptions = {
        position: options?.position || { lat: 40.7128, lng: -74.006 },
        pov: options?.pov || { heading: 0, pitch: 0 },
        zoom: options?.zoom || 1,
        visible: options?.visible !== false,
        disableDefaultUI: options?.disableDefaultUI || false,
        scrollwheel: options?.scrollwheel !== false,
        disableDoubleClickZoom: options?.disableDoubleClickZoom || false,
        clickToGo: options?.clickToGo !== false,
        controlSize: options?.controlSize || 40,
        fullscreenControl: options?.fullscreenControl !== false,
        linksControl: options?.linksControl !== false,
        panControl: options?.panControl !== false,
        zoomControl: options?.zoomControl !== false,
        addressControl: options?.addressControl !== false,
        motionTracking: options?.motionTracking || false,
        motionTrackingControl: options?.motionTrackingControl !== false,
        showRoadLabels: options?.showRoadLabels !== false,
        ...options,
      };

      return new google.maps.StreetViewPanorama(container, panoramaOptions);
    },
    []
  );

  const getPanoramaByLocation = useCallback(
    async (
      location: google.maps.LatLngLiteral,
      radius?: number
    ): Promise<StreetViewPanoramaData> => {
      return getPanorama({ location, radius });
    },
    [getPanorama]
  );

  const getPanoramaById = useCallback(
    async (panoId: string): Promise<StreetViewPanoramaData> => {
      return getPanorama({ pano: panoId });
    },
    [getPanorama]
  );

  return {
    isLoading,
    error,
    panoramaData,
    getPanorama,
    createPanorama,
    getPanoramaByLocation,
    getPanoramaById,
  };
}
