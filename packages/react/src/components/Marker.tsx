import React, { useEffect, useRef } from 'react';
import { useMarkers, MarkerOptions } from '../hooks/useMarkers';
import { MapInstance } from '@gmaps-kit/core';

export interface MarkerProps extends MarkerOptions {
  mapInstance: MapInstance | null;
  onMarkerCreated?: (marker: google.maps.marker.AdvancedMarkerElement) => void;
}

export const Marker: React.FC<MarkerProps> = ({
  mapInstance,
  onMarkerCreated,
  ...markerOptions
}) => {
  const { addMarker, removeMarker } = useMarkers(mapInstance);
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(
    null
  );

  useEffect(() => {
    if (!mapInstance) return;

    // Remove existing marker if it exists
    if (markerRef.current) {
      removeMarker(markerRef.current);
    }

    // Add new marker
    const marker = addMarker(markerOptions);
    markerRef.current = marker;
    onMarkerCreated?.(marker);

    // Cleanup function
    return () => {
      if (markerRef.current) {
        removeMarker(markerRef.current);
        markerRef.current = null;
      }
    };
  }, [
    mapInstance,
    markerOptions.position.lat,
    markerOptions.position.lng,
    markerOptions.title,
    markerOptions.content,
    markerOptions.draggable,
    markerOptions.clickable,
    markerOptions.zIndex,
    markerOptions.onClick,
    markerOptions.onDrag,
    markerOptions.onDragEnd,
    addMarker,
    removeMarker,
    onMarkerCreated,
  ]);

  return null; // Marker is rendered on the map, not as a DOM element
};
