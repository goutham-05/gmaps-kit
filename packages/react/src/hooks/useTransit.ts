import { useState, useCallback, useEffect } from 'react';

export interface TransitOptions {
  map?: google.maps.Map;
  autoRefresh?: boolean;
  autoRefreshInterval?: number;
}

export interface UseTransitReturn {
  isLoading: boolean;
  error: Error | null;
  transitLayer: google.maps.TransitLayer | null;
  isVisible: boolean;
  createTransitLayer: (options?: TransitOptions) => google.maps.TransitLayer;
  showTransit: () => void;
  hideTransit: () => void;
  toggleTransit: () => void;
  refreshTransit: () => void;
  removeTransitLayer: () => void;
}

export function useTransit(): UseTransitReturn {
  const [isLoading] = useState(false);
  const [error] = useState<Error | null>(null);
  const [transitLayer, setTransitLayer] =
    useState<google.maps.TransitLayer | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const createTransitLayer = useCallback(
    (options?: TransitOptions): google.maps.TransitLayer => {
      try {
        const transit = new google.maps.TransitLayer();

        if (options?.map) {
          transit.setMap(options.map);
          setIsVisible(true);
        }

        setTransitLayer(transit);
        return transit;
      } catch (err) {
        const error =
          err instanceof Error
            ? err
            : new Error('Transit layer creation failed');
        throw error;
      }
    },
    []
  );

  const showTransit = useCallback(() => {
    if (transitLayer) {
      transitLayer.setMap(transitLayer.getMap());
      setIsVisible(true);
    }
  }, [transitLayer]);

  const hideTransit = useCallback(() => {
    if (transitLayer) {
      transitLayer.setMap(null);
      setIsVisible(false);
    }
  }, [transitLayer]);

  const toggleTransit = useCallback(() => {
    if (isVisible) {
      hideTransit();
    } else {
      showTransit();
    }
  }, [isVisible, showTransit, hideTransit]);

  const refreshTransit = useCallback(() => {
    if (transitLayer) {
      // Transit layer automatically refreshes, but we can trigger a refresh
      // by temporarily hiding and showing it
      const currentMap = transitLayer.getMap();
      if (currentMap) {
        transitLayer.setMap(null);
        setTimeout(() => {
          transitLayer.setMap(currentMap);
        }, 100);
      }
    }
  }, [transitLayer]);

  const removeTransitLayer = useCallback(() => {
    if (transitLayer) {
      transitLayer.setMap(null);
      setTransitLayer(null);
      setIsVisible(false);
    }
  }, [transitLayer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (transitLayer) {
        transitLayer.setMap(null);
      }
    };
  }, [transitLayer]);

  return {
    isLoading,
    error,
    transitLayer,
    isVisible,
    createTransitLayer,
    showTransit,
    hideTransit,
    toggleTransit,
    refreshTransit,
    removeTransitLayer,
  };
}
