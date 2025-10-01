import { useState, useCallback, useEffect } from 'react';
import { MapInstance } from '@gmaps-kit/core';

// Type definitions for MarkerClusterer (external library)
declare global {
  namespace google.maps {
    interface MarkerClustererOptions {
      gridSize?: number;
      maxZoom?: number;
      minimumClusterSize?: number;
      averageCenter?: boolean;
      ignoreHidden?: boolean;
      enableRetinaIcons?: boolean;
      styles?: ClusterIconStyle[];
      imagePath?: string;
      imageExtension?: string;
      zoomOnClick?: boolean;
    }

    interface ClusterIconStyle {
      url: string;
      height: number;
      width: number;
      anchor?: number[] | google.maps.Point;
      textColor?: string;
      textSize?: number;
      backgroundPosition?: string;
    }

    class MarkerClusterer {
      constructor(
        map: google.maps.Map,
        markers?: google.maps.Marker[],
        options?: MarkerClustererOptions
      );
      addMarker(marker: google.maps.Marker): void;
      addMarkers(markers: google.maps.Marker[]): void;
      removeMarker(marker: google.maps.Marker): void;
      removeMarkers(markers: google.maps.Marker[]): void;
      clearMarkers(): void;
      redraw(): void;
      getMarkers(): google.maps.Marker[];
      getTotalMarkers(): number;
      getTotalClusters(): number;
    }
  }
}

export interface ClusterOptions {
  gridSize?: number;
  maxZoom?: number;
  minimumClusterSize?: number;
  averageCenter?: boolean;
  ignoreHidden?: boolean;
  enableRetinaIcons?: boolean;
  styles?: google.maps.ClusterIconStyle[];
  imagePath?: string;
  imageExtension?: string;
  zoomOnClick?: boolean;
}

export interface ClusterMarker {
  position: google.maps.LatLngLiteral;
  title?: string;
  data?: any;
}

export interface UseClusteringReturn {
  clusterer: google.maps.MarkerClusterer | null;
  isReady: boolean;
  createClusterer: (
    mapInstance: MapInstance,
    markers: google.maps.Marker[],
    options?: ClusterOptions
  ) => google.maps.MarkerClusterer;
  addMarkersToCluster: (markers: google.maps.Marker[]) => void;
  removeMarkersFromCluster: (markers: google.maps.Marker[]) => void;
  clearCluster: () => void;
  redrawCluster: () => void;
  getClusterer: () => google.maps.MarkerClusterer | null;
  getTotalMarkers: () => number;
  getTotalClusters: () => number;
  getMarkers: () => google.maps.Marker[];
}

/**
 * Check if MarkerClusterer library is loaded
 */
export function isMarkerClustererLoaded(): boolean {
  return typeof (google.maps as any).MarkerClusterer !== 'undefined';
}

export function useClustering(): UseClusteringReturn {
  const [clusterer, setClusterer] =
    useState<google.maps.MarkerClusterer | null>(null);
  const [isReady, setIsReady] = useState(false);

  const createClusterer = useCallback(
    (
      mapInstance: MapInstance,
      markers: google.maps.Marker[],
      options: ClusterOptions = {}
    ): google.maps.MarkerClusterer => {
      // Check if MarkerClusterer is available
      if (!isMarkerClustererLoaded()) {
        throw new Error(
          'MarkerClusterer library is not loaded. Please include the markerclusterer library from https://github.com/googlemaps/js-markerclusterer.'
        );
      }

      const clustererOptions: google.maps.MarkerClustererOptions = {
        gridSize: options.gridSize || 60,
        maxZoom: options.maxZoom || 15,
        minimumClusterSize: options.minimumClusterSize || 2,
        averageCenter: options.averageCenter || false,
        ignoreHidden: options.ignoreHidden || false,
        enableRetinaIcons: options.enableRetinaIcons || false,
        styles: options.styles,
        imagePath: options.imagePath,
        imageExtension: options.imageExtension || 'png',
        zoomOnClick: options.zoomOnClick !== false,
      };

      const newClusterer = new (google.maps as any).MarkerClusterer(
        mapInstance.map,
        markers,
        clustererOptions
      );

      setClusterer(newClusterer);
      setIsReady(true);

      return newClusterer;
    },
    []
  );

  const addMarkersToCluster = useCallback(
    (markers: google.maps.Marker[]) => {
      if (!clusterer) {
        throw new Error('Clusterer is not initialized');
      }

      clusterer.addMarkers(markers);
    },
    [clusterer]
  );

  const removeMarkersFromCluster = useCallback(
    (markers: google.maps.Marker[]) => {
      if (!clusterer) {
        throw new Error('Clusterer is not initialized');
      }

      clusterer.removeMarkers(markers);
    },
    [clusterer]
  );

  const clearCluster = useCallback(() => {
    if (!clusterer) {
      throw new Error('Clusterer is not initialized');
    }

    clusterer.clearMarkers();
  }, [clusterer]);

  const redrawCluster = useCallback(() => {
    if (!clusterer) {
      throw new Error('Clusterer is not initialized');
    }

    clusterer.redraw();
  }, [clusterer]);

  const getClusterer = useCallback((): google.maps.MarkerClusterer | null => {
    return clusterer;
  }, [clusterer]);

  const getTotalMarkers = useCallback((): number => {
    if (!clusterer) {
      return 0;
    }
    return clusterer.getTotalMarkers();
  }, [clusterer]);

  const getTotalClusters = useCallback((): number => {
    if (!clusterer) {
      return 0;
    }
    return clusterer.getTotalClusters();
  }, [clusterer]);

  const getMarkers = useCallback((): google.maps.Marker[] => {
    if (!clusterer) {
      return [];
    }
    return clusterer.getMarkers();
  }, [clusterer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (clusterer) {
        clusterer.clearMarkers();
      }
    };
  }, [clusterer]);

  return {
    clusterer,
    isReady,
    createClusterer,
    addMarkersToCluster,
    removeMarkersFromCluster,
    clearCluster,
    redrawCluster,
    getClusterer,
    getTotalMarkers,
    getTotalClusters,
    getMarkers,
  };
}
