import { useState, useCallback, useEffect } from 'react';

export interface HeatmapData {
  location: google.maps.LatLngLiteral;
  weight?: number;
}

export interface HeatmapOptions {
  data: HeatmapData[];
  map?: google.maps.Map;
  radius?: number;
  opacity?: number;
  maxIntensity?: number;
  gradient?: string[];
  dissipating?: boolean;
}

export interface UseHeatmapReturn {
  isLoading: boolean;
  error: Error | null;
  heatmapLayer: google.maps.visualization.HeatmapLayer | null;
  createHeatmap: (
    options: HeatmapOptions
  ) => google.maps.visualization.HeatmapLayer;
  updateHeatmapData: (data: HeatmapData[]) => void;
  setHeatmapOptions: (options: Partial<HeatmapOptions>) => void;
  showHeatmap: () => void;
  hideHeatmap: () => void;
  removeHeatmap: () => void;
}

export function useHeatmap(): UseHeatmapReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [heatmapLayer, setHeatmapLayer] =
    useState<google.maps.visualization.HeatmapLayer | null>(null);

  const handleAsyncOperation = useCallback(
    async <T>(operation: () => T): Promise<T> => {
      setIsLoading(true);
      setError(null);

      try {
        const data = operation();
        return data;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error('Heatmap operation failed');
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const createHeatmap = useCallback(
    (options: HeatmapOptions): google.maps.visualization.HeatmapLayer => {
      return handleAsyncOperation(() => {
        const heatmapData: google.maps.visualization.WeightedLocation[] =
          options.data.map((point) => ({
            location: new google.maps.LatLng(
              point.location.lat,
              point.location.lng
            ),
            weight: point.weight || 1,
          }));

        const heatmapOptions: google.maps.visualization.HeatmapLayerOptions = {
          data: heatmapData,
          map: options.map,
          radius: options.radius || 20,
          opacity: options.opacity || 0.6,
          maxIntensity: options.maxIntensity || 1,
          gradient: options.gradient,
          dissipating: options.dissipating !== false,
        };

        const heatmap = new google.maps.visualization.HeatmapLayer(
          heatmapOptions
        );
        setHeatmapLayer(heatmap);
        return heatmap;
      });
    },
    [handleAsyncOperation]
  );

  const updateHeatmapData = useCallback(
    (data: HeatmapData[]) => {
      if (heatmapLayer) {
        const heatmapData: google.maps.visualization.WeightedLocation[] =
          data.map((point) => ({
            location: new google.maps.LatLng(
              point.location.lat,
              point.location.lng
            ),
            weight: point.weight || 1,
          }));
        heatmapLayer.setData(heatmapData);
      }
    },
    [heatmapLayer]
  );

  const setHeatmapOptions = useCallback(
    (options: Partial<HeatmapOptions>) => {
      if (heatmapLayer) {
        if (options.radius !== undefined) {
          heatmapLayer.set('radius', options.radius);
        }
        if (options.opacity !== undefined) {
          heatmapLayer.set('opacity', options.opacity);
        }
        if (options.maxIntensity !== undefined) {
          heatmapLayer.set('maxIntensity', options.maxIntensity);
        }
        if (options.gradient !== undefined) {
          heatmapLayer.set('gradient', options.gradient);
        }
        if (options.dissipating !== undefined) {
          heatmapLayer.set('dissipating', options.dissipating);
        }
      }
    },
    [heatmapLayer]
  );

  const showHeatmap = useCallback(() => {
    if (heatmapLayer) {
      heatmapLayer.setMap(heatmapLayer.getMap());
    }
  }, [heatmapLayer]);

  const hideHeatmap = useCallback(() => {
    if (heatmapLayer) {
      heatmapLayer.setMap(null);
    }
  }, [heatmapLayer]);

  const removeHeatmap = useCallback(() => {
    if (heatmapLayer) {
      heatmapLayer.setMap(null);
      setHeatmapLayer(null);
    }
  }, [heatmapLayer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (heatmapLayer) {
        heatmapLayer.setMap(null);
      }
    };
  }, [heatmapLayer]);

  return {
    isLoading,
    error,
    heatmapLayer,
    createHeatmap,
    updateHeatmapData,
    setHeatmapOptions,
    showHeatmap,
    hideHeatmap,
    removeHeatmap,
  };
}
