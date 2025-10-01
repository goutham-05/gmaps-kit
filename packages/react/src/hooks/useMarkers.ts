import { useState, useCallback, useEffect } from 'react';
import {
  addMarker,
  removeMarker,
  updateMarkerPosition,
  updateMarkerContent,
  clearMarkers,
  getMarkerPosition,
  setMarkerDraggable,
  addMarkerClickListener,
  addMarkerDragListener,
  addMarkerDragEndListener,
} from '@gmaps-kit/core';
import { MapInstance } from '@gmaps-kit/core';

export interface MarkerOptions {
  position: google.maps.LatLngLiteral;
  title?: string;
  content?: HTMLElement;
  draggable?: boolean;
  clickable?: boolean;
  zIndex?: number;
  onClick?: () => void;
  onDrag?: () => void;
  onDragEnd?: () => void;
}

export interface UseMarkersReturn {
  markers: google.maps.marker.AdvancedMarkerElement[];
  addMarker: (
    options: MarkerOptions
  ) => google.maps.marker.AdvancedMarkerElement;
  removeMarker: (marker: google.maps.marker.AdvancedMarkerElement) => void;
  updateMarker: (
    marker: google.maps.marker.AdvancedMarkerElement,
    options: Partial<MarkerOptions>
  ) => void;
  clearAllMarkers: () => void;
  getMarkerPosition: (
    marker: google.maps.marker.AdvancedMarkerElement
  ) => google.maps.LatLngLiteral | null;
}

export function useMarkers(mapInstance: MapInstance | null): UseMarkersReturn {
  const [markers, setMarkers] = useState<
    google.maps.marker.AdvancedMarkerElement[]
  >([]);

  const addMarkerToMap = useCallback(
    (options: MarkerOptions): google.maps.marker.AdvancedMarkerElement => {
      if (!mapInstance) {
        throw new Error('Map instance is not available');
      }

      const marker = addMarker(mapInstance.map, {
        position: options.position,
        title: options.title,
        content: options.content,
        draggable: options.draggable,
        clickable: options.clickable,
        zIndex: options.zIndex,
      });

      // Add event listeners
      if (options.onClick) {
        addMarkerClickListener(marker, options.onClick);
      }
      if (options.onDrag) {
        addMarkerDragListener(marker, options.onDrag);
      }
      if (options.onDragEnd) {
        addMarkerDragEndListener(marker, options.onDragEnd);
      }

      setMarkers((prev) => [...prev, marker]);
      return marker;
    },
    [mapInstance]
  );

  const removeMarkerFromMap = useCallback(
    (marker: google.maps.marker.AdvancedMarkerElement) => {
      removeMarker(marker);
      setMarkers((prev) => prev.filter((m) => m !== marker));
    },
    []
  );

  const updateMarkerOnMap = useCallback(
    (
      marker: google.maps.marker.AdvancedMarkerElement,
      options: Partial<MarkerOptions>
    ) => {
      if (options.position) {
        updateMarkerPosition(marker, options.position);
      }
      if (options.content) {
        updateMarkerContent(marker, options.content);
      }
      if (options.draggable !== undefined) {
        setMarkerDraggable(marker, options.draggable);
      }
      // Note: setMarkerVisibility is not available in the core package
      // You can use marker.visible directly if needed
    },
    []
  );

  const clearAllMarkersFromMap = useCallback(() => {
    // Clear markers from the map by setting their map property to null
    markers.forEach((marker) => {
      marker.map = null;
    });
    setMarkers([]);
  }, [markers]);

  const getMarkerPositionFromMap = useCallback(
    (marker: google.maps.marker.AdvancedMarkerElement) => {
      return getMarkerPosition(marker);
    },
    []
  );

  // Clear markers when mapInstance becomes null
  useEffect(() => {
    if (!mapInstance) {
      setMarkers([]);
    }
  }, [mapInstance]);

  return {
    markers,
    addMarker: addMarkerToMap,
    removeMarker: removeMarkerFromMap,
    updateMarker: updateMarkerOnMap,
    clearAllMarkers: clearAllMarkersFromMap,
    getMarkerPosition: getMarkerPositionFromMap,
  };
}
