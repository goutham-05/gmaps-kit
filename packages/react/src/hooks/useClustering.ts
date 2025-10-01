import { useState, useCallback, useEffect } from 'react';
import { MapInstance } from '@gmaps-kit/core';

export interface ClusterOptions {
  gridSize?: number;
  maxZoom?: number;
  minimumClusterSize?: number;
  averageCenter?: boolean;
  ignoreHidden?: boolean;
  enableRetinaIcons?: boolean;
  styles?: google.maps.MarkerClustererOptions['styles'];
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
    markers: google.maps.marker.AdvancedMarkerElement[],
    options?: ClusterOptions
  ) => google.maps.MarkerClusterer;
  addMarkersToCluster: (
    markers: google.maps.marker.AdvancedMarkerElement[]
  ) => void;
  removeMarkersFromCluster: (
    markers: google.maps.marker.AdvancedMarkerElement[]
  ) => void;
  clearCluster: () => void;
  redrawCluster: () => void;
  getClusterer: () => google.maps.MarkerClusterer | null;
}

export function useClustering(): UseClusteringReturn {
  const [clusterer, setClusterer] =
    useState<google.maps.MarkerClusterer | null>(null);
  const [isReady, setIsReady] = useState(false);

  const createClusterer = useCallback(
    (
      mapInstance: MapInstance,
      markers: google.maps.marker.AdvancedMarkerElement[],
      options: ClusterOptions = {}
    ): google.maps.MarkerClusterer => {
      // Check if MarkerClusterer is available
      if (typeof google.maps.MarkerClusterer === 'undefined') {
        throw new Error(
          'MarkerClusterer library is not loaded. Please include the markerclusterer library.'
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

      const newClusterer = new google.maps.MarkerClusterer(
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
    (markers: google.maps.marker.AdvancedMarkerElement[]) => {
      if (!clusterer) {
        throw new Error('Clusterer is not initialized');
      }

      clusterer.addMarkers(markers);
    },
    [clusterer]
  );

  const removeMarkersFromCluster = useCallback(
    (markers: google.maps.marker.AdvancedMarkerElement[]) => {
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
  };
}
