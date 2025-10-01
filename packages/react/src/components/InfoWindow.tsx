import React, { useEffect, useRef } from 'react';
import {
  createInfoWindow,
  openInfoWindow,
  closeInfoWindow,
} from '@gmaps-kit/core';
import { MapInstance } from '@gmaps-kit/core';

export interface InfoWindowProps {
  mapInstance: MapInstance | null;
  marker?: google.maps.marker.AdvancedMarkerElement;
  content: string | React.ReactNode;
  position?: google.maps.LatLngLiteral;
  isOpen?: boolean;
  onClose?: () => void;
}

export const InfoWindow: React.FC<InfoWindowProps> = ({
  mapInstance,
  marker,
  content,
  position,
  isOpen = false,
  onClose,
}) => {
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  useEffect(() => {
    if (!mapInstance) return;

    // Create InfoWindow if it doesn't exist
    if (!infoWindowRef.current) {
      const infoWindow = createInfoWindow({
        content: typeof content === 'string' ? content : '',
      });
      infoWindowRef.current = infoWindow;

      // Add close listener
      infoWindow.addListener('closeclick', () => {
        onClose?.();
      });
    }

    // Update content if it changed
    if (infoWindowRef.current) {
      infoWindowRef.current.setContent(
        typeof content === 'string' ? content : ''
      );
    }
  }, [content, onClose]);

  useEffect(() => {
    if (!mapInstance || !infoWindowRef.current) return;

    if (isOpen) {
      if (marker) {
        openInfoWindow(infoWindowRef.current, marker, mapInstance.map);
      } else if (position) {
        // For position without marker, we need to create a temporary marker
        const tempMarker = new google.maps.marker.AdvancedMarkerElement({
          position: position,
          map: mapInstance.map,
        });
        openInfoWindow(infoWindowRef.current, tempMarker, mapInstance.map);
        // Clean up the temporary marker after a short delay
        setTimeout(() => {
          tempMarker.map = null;
        }, 100);
      }
    } else {
      closeInfoWindow(infoWindowRef.current);
    }
  }, [mapInstance, marker, position, isOpen]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (infoWindowRef.current) {
        closeInfoWindow(infoWindowRef.current);
      }
    };
  }, []);

  return null; // InfoWindow is rendered on the map, not as a DOM element
};
