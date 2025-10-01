import { useState, useCallback, useEffect } from 'react';

export interface BicyclingOptions {
  map?: google.maps.Map;
  autoRefresh?: boolean;
  autoRefreshInterval?: number;
}

export interface UseBicyclingReturn {
  isLoading: boolean;
  error: Error | null;
  bicyclingLayer: google.maps.BicyclingLayer | null;
  isVisible: boolean;
  createBicyclingLayer: (
    options?: BicyclingOptions
  ) => google.maps.BicyclingLayer;
  showBicycling: () => void;
  hideBicycling: () => void;
  toggleBicycling: () => void;
  refreshBicycling: () => void;
  removeBicyclingLayer: () => void;
}

export function useBicycling(): UseBicyclingReturn {
  const [isLoading] = useState(false);
  const [error] = useState<Error | null>(null);
  const [bicyclingLayer, setBicyclingLayer] =
    useState<google.maps.BicyclingLayer | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const createBicyclingLayer = useCallback(
    (options?: BicyclingOptions): google.maps.BicyclingLayer => {
      const bicycling = new google.maps.BicyclingLayer();

      if (options?.map) {
        bicycling.setMap(options.map);
        setIsVisible(true);
      }

      setBicyclingLayer(bicycling);
      return bicycling;
    },
    []
  );

  const showBicycling = useCallback(() => {
    if (bicyclingLayer) {
      bicyclingLayer.setMap(bicyclingLayer.getMap());
      setIsVisible(true);
    }
  }, [bicyclingLayer]);

  const hideBicycling = useCallback(() => {
    if (bicyclingLayer) {
      bicyclingLayer.setMap(null);
      setIsVisible(false);
    }
  }, [bicyclingLayer]);

  const toggleBicycling = useCallback(() => {
    if (isVisible) {
      hideBicycling();
    } else {
      showBicycling();
    }
  }, [isVisible, showBicycling, hideBicycling]);

  const refreshBicycling = useCallback(() => {
    if (bicyclingLayer) {
      // Bicycling layer automatically refreshes, but we can trigger a refresh
      // by temporarily hiding and showing it
      const currentMap = bicyclingLayer.getMap();
      if (currentMap) {
        bicyclingLayer.setMap(null);
        setTimeout(() => {
          bicyclingLayer.setMap(currentMap);
        }, 100);
      }
    }
  }, [bicyclingLayer]);

  const removeBicyclingLayer = useCallback(() => {
    if (bicyclingLayer) {
      bicyclingLayer.setMap(null);
      setBicyclingLayer(null);
      setIsVisible(false);
    }
  }, [bicyclingLayer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (bicyclingLayer) {
        bicyclingLayer.setMap(null);
      }
    };
  }, [bicyclingLayer]);

  return {
    isLoading,
    error,
    bicyclingLayer,
    isVisible,
    createBicyclingLayer,
    showBicycling,
    hideBicycling,
    toggleBicycling,
    refreshBicycling,
    removeBicyclingLayer,
  };
}
