import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  createMap,
  getMapCenter,
  setMapCenter,
  getMapZoom,
  setMapZoom,
  panTo,
  fitMapToMarkers,
  MapInstance,
  MapOptions,
} from '@gmaps-kit/core';

export interface UseMapOptions {
  center?: google.maps.LatLngLiteral;
  zoom?: number;
  mapTypeId?: google.maps.MapTypeId;
  mapId?: string;
  onMapReady?: (map: MapInstance) => void;
}

export interface UseMapReturn {
  mapInstance: MapInstance | null;
  isReady: boolean;
  center: google.maps.LatLngLiteral | null;
  zoom: number | null;
  setCenter: (center: google.maps.LatLngLiteral) => void;
  setZoom: (zoom: number) => void;
  panTo: (center: google.maps.LatLngLiteral, zoom?: number) => void;
  fitToMarkers: (markers: google.maps.Marker[]) => void;
}

export function useMap(
  containerId: string,
  options: UseMapOptions = {}
): UseMapReturn {
  const [mapInstance, setMapInstance] = useState<MapInstance | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [center, setCenterState] = useState<google.maps.LatLngLiteral | null>(
    null
  );
  const [zoom, setZoomState] = useState<number | null>(null);

  // Memoize options to prevent unnecessary re-renders
  const memoizedOptions = useMemo(
    () => options,
    [
      options.center?.lat,
      options.center?.lng,
      options.zoom,
      options.mapTypeId,
      options.mapId,
      options.onMapReady,
    ]
  );

  const initializeMap = useCallback(() => {
    if (!containerId || mapInstance) return; // Prevent re-initialization

    try {
      const mapOptions = {
        center: memoizedOptions.center || { lat: 40.7128, lng: -74.006 },
        zoom: memoizedOptions.zoom || 10,
        mapTypeId: memoizedOptions.mapTypeId,
        mapId: memoizedOptions.mapId,
      };

      const map = createMap(containerId, mapOptions);

      setMapInstance(map);
      setIsReady(true);
      setCenterState(getMapCenter(map.map));
      setZoomState(getMapZoom(map.map));
      memoizedOptions.onMapReady?.(map);
    } catch (error) {
      console.error('Failed to initialize map:', error);
    }
  }, [containerId, memoizedOptions, mapInstance]);

  useEffect(() => {
    initializeMap();
  }, [initializeMap]);

  const setCenter = useCallback(
    (newCenter: google.maps.LatLngLiteral) => {
      if (mapInstance) {
        setMapCenter(mapInstance.map, newCenter);
        setCenterState(newCenter);
      }
    },
    [mapInstance]
  );

  const setZoom = useCallback(
    (newZoom: number) => {
      if (mapInstance) {
        setMapZoom(mapInstance.map, newZoom);
        setZoomState(newZoom);
      }
    },
    [mapInstance]
  );

  const panToLocation = useCallback(
    (newCenter: google.maps.LatLngLiteral, newZoom?: number) => {
      if (mapInstance) {
        panTo(mapInstance.map, newCenter, newZoom);
        setCenterState(newCenter);
        if (newZoom !== undefined) {
          setZoomState(newZoom);
        }
      }
    },
    [mapInstance]
  );

  const fitToMarkers = useCallback(
    (markers: google.maps.Marker[]) => {
      if (mapInstance) {
        fitMapToMarkers(mapInstance.map, markers);
      }
    },
    [mapInstance]
  );

  return {
    mapInstance,
    isReady,
    center,
    zoom,
    setCenter,
    setZoom,
    panTo: panToLocation,
    fitToMarkers,
  };
}
