import { useState, useCallback, useEffect } from 'react';

export interface TrafficOptions {
  map?: google.maps.Map;
  autoRefresh?: boolean;
  autoRefreshInterval?: number;
}

export interface UseTrafficReturn {
  isLoading: boolean;
  error: Error | null;
  trafficLayer: google.maps.TrafficLayer | null;
  isVisible: boolean;
  createTrafficLayer: (options?: TrafficOptions) => google.maps.TrafficLayer;
  showTraffic: () => void;
  hideTraffic: () => void;
  toggleTraffic: () => void;
  refreshTraffic: () => void;
  removeTrafficLayer: () => void;
}

export function useTraffic(): UseTrafficReturn {
  const [isLoading] = useState(false);
  const [error] = useState<Error | null>(null);
  const [trafficLayer, setTrafficLayer] =
    useState<google.maps.TrafficLayer | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const createTrafficLayer = useCallback(
    (options?: TrafficOptions): google.maps.TrafficLayer => {
      try {
        const traffic = new google.maps.TrafficLayer();

        if (options?.map) {
          traffic.setMap(options.map);
          setIsVisible(true);
        }

        setTrafficLayer(traffic);
        return traffic;
      } catch (err) {
        const error =
          err instanceof Error
            ? err
            : new Error('Traffic layer creation failed');
        throw error;
      }
    },
    []
  );

  const showTraffic = useCallback(() => {
    if (trafficLayer) {
      trafficLayer.setMap(trafficLayer.getMap());
      setIsVisible(true);
    }
  }, [trafficLayer]);

  const hideTraffic = useCallback(() => {
    if (trafficLayer) {
      trafficLayer.setMap(null);
      setIsVisible(false);
    }
  }, [trafficLayer]);

  const toggleTraffic = useCallback(() => {
    if (isVisible) {
      hideTraffic();
    } else {
      showTraffic();
    }
  }, [isVisible, showTraffic, hideTraffic]);

  const refreshTraffic = useCallback(() => {
    if (trafficLayer) {
      // Traffic layer automatically refreshes, but we can trigger a refresh
      // by temporarily hiding and showing it
      const currentMap = trafficLayer.getMap();
      if (currentMap) {
        trafficLayer.setMap(null);
        setTimeout(() => {
          trafficLayer.setMap(currentMap);
        }, 100);
      }
    }
  }, [trafficLayer]);

  const removeTrafficLayer = useCallback(() => {
    if (trafficLayer) {
      trafficLayer.setMap(null);
      setTrafficLayer(null);
      setIsVisible(false);
    }
  }, [trafficLayer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (trafficLayer) {
        trafficLayer.setMap(null);
      }
    };
  }, [trafficLayer]);

  return {
    isLoading,
    error,
    trafficLayer,
    isVisible,
    createTrafficLayer,
    showTraffic,
    hideTraffic,
    toggleTraffic,
    refreshTraffic,
    removeTrafficLayer,
  };
}
