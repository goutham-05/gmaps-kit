import { useState, useCallback, useEffect } from 'react';
import {
  createInfoWindow,
  openInfoWindow,
  closeInfoWindow,
} from '@gmaps-kit/core';
import { MapInstance } from '@gmaps-kit/core';

export interface InfoWindowOptions {
  content: string | HTMLElement;
  position?: google.maps.LatLngLiteral;
  maxWidth?: number;
  pixelOffset?: google.maps.Size;
  zIndex?: number;
}

export interface InfoWindowInstance {
  infoWindow: google.maps.InfoWindow;
  id: string;
  isOpen: boolean;
  content: string | HTMLElement;
  position?: google.maps.LatLngLiteral;
}

export interface UseInfoWindowsReturn {
  infoWindows: InfoWindowInstance[];
  activeInfoWindow: InfoWindowInstance | null;
  createInfoWindowInstance: (options: InfoWindowOptions) => InfoWindowInstance;
  openInfoWindowInstance: (
    infoWindow: InfoWindowInstance,
    marker?: google.maps.marker.AdvancedMarkerElement,
    mapInstance?: MapInstance
  ) => void;
  closeInfoWindowInstance: (infoWindow: InfoWindowInstance) => void;
  closeAllInfoWindows: () => void;
  updateInfoWindowContent: (
    infoWindow: InfoWindowInstance,
    content: string | HTMLElement
  ) => void;
  removeInfoWindow: (infoWindow: InfoWindowInstance) => void;
}

export function useInfoWindows(): UseInfoWindowsReturn {
  const [infoWindows, setInfoWindows] = useState<InfoWindowInstance[]>([]);
  const [activeInfoWindow, setActiveInfoWindow] =
    useState<InfoWindowInstance | null>(null);

  const createInfoWindowInstance = useCallback(
    (options: InfoWindowOptions): InfoWindowInstance => {
      // Convert HTMLElement to string if needed
      const contentString =
        typeof options.content === 'string'
          ? options.content
          : options.content.outerHTML;

      const infoWindow = createInfoWindow({
        content: contentString,
        position: options.position,
        maxWidth: options.maxWidth,
        pixelOffset: options.pixelOffset,
        disableAutoPan: false,
      });

      const infoWindowInstance: InfoWindowInstance = {
        infoWindow,
        id: `infowindow-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        isOpen: false,
        content: options.content,
        position: options.position,
      };

      setInfoWindows((prev) => [...prev, infoWindowInstance]);
      return infoWindowInstance;
    },
    []
  );

  const openInfoWindowInstance = useCallback(
    (
      infoWindowInstance: InfoWindowInstance,
      marker?: google.maps.marker.AdvancedMarkerElement,
      mapInstance?: MapInstance
    ) => {
      if (!mapInstance) {
        throw new Error('Map instance is required to open InfoWindow');
      }

      // Close any currently open InfoWindow
      if (activeInfoWindow) {
        closeInfoWindow(activeInfoWindow.infoWindow);
      }

      if (marker) {
        openInfoWindow(infoWindowInstance.infoWindow, marker, mapInstance.map);
      } else if (infoWindowInstance.position) {
        // For position-based InfoWindows, we need to open them directly on the map
        infoWindowInstance.infoWindow.setPosition(infoWindowInstance.position);
        infoWindowInstance.infoWindow.open(mapInstance.map);
      } else {
        throw new Error('Either marker or position must be provided');
      }

      // Update the InfoWindow instance state
      setInfoWindows((prev) =>
        prev.map((iw) =>
          iw.id === infoWindowInstance.id
            ? { ...iw, isOpen: true }
            : { ...iw, isOpen: false }
        )
      );

      setActiveInfoWindow({ ...infoWindowInstance, isOpen: true });
    },
    [activeInfoWindow]
  );

  const closeInfoWindowInstance = useCallback(
    (infoWindowInstance: InfoWindowInstance) => {
      closeInfoWindow(infoWindowInstance.infoWindow);

      setInfoWindows((prev) =>
        prev.map((iw) =>
          iw.id === infoWindowInstance.id ? { ...iw, isOpen: false } : iw
        )
      );

      if (activeInfoWindow?.id === infoWindowInstance.id) {
        setActiveInfoWindow(null);
      }
    },
    [activeInfoWindow]
  );

  const closeAllInfoWindows = useCallback(() => {
    infoWindows.forEach((infoWindowInstance) => {
      closeInfoWindow(infoWindowInstance.infoWindow);
    });

    setInfoWindows((prev) => prev.map((iw) => ({ ...iw, isOpen: false })));

    setActiveInfoWindow(null);
  }, [infoWindows]);

  const updateInfoWindowContent = useCallback(
    (infoWindowInstance: InfoWindowInstance, content: string | HTMLElement) => {
      infoWindowInstance.infoWindow.setContent(content);

      setInfoWindows((prev) =>
        prev.map((iw) =>
          iw.id === infoWindowInstance.id ? { ...iw, content } : iw
        )
      );

      if (activeInfoWindow?.id === infoWindowInstance.id) {
        setActiveInfoWindow({ ...infoWindowInstance, content });
      }
    },
    [activeInfoWindow]
  );

  const removeInfoWindow = useCallback(
    (infoWindowInstance: InfoWindowInstance) => {
      // Close the InfoWindow if it's open
      if (infoWindowInstance.isOpen) {
        closeInfoWindow(infoWindowInstance.infoWindow);
      }

      setInfoWindows((prev) =>
        prev.filter((iw) => iw.id !== infoWindowInstance.id)
      );

      if (activeInfoWindow?.id === infoWindowInstance.id) {
        setActiveInfoWindow(null);
      }
    },
    [activeInfoWindow]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      infoWindows.forEach((infoWindowInstance) => {
        if (infoWindowInstance.isOpen) {
          closeInfoWindow(infoWindowInstance.infoWindow);
        }
      });
    };
  }, [infoWindows]);

  return {
    infoWindows,
    activeInfoWindow,
    createInfoWindowInstance,
    openInfoWindowInstance,
    closeInfoWindowInstance,
    closeAllInfoWindows,
    updateInfoWindowContent,
    removeInfoWindow,
  };
}
