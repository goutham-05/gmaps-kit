import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  createStreetViewPanorama,
  setStreetViewPosition,
  getStreetViewPosition,
  setStreetViewPov,
  getStreetViewPov,
  setStreetViewVisibility,
  isStreetViewVisible,
} from '@gmaps-kit/core';
import type {
  StreetViewOptions,
  StreetViewEventHandlers,
  StreetViewInstance,
} from '@gmaps-kit/core';

export interface UseStreetViewOptions extends StreetViewOptions {
  eventHandlers?: StreetViewEventHandlers;
}

export interface UseStreetViewReturn {
  instance: StreetViewInstance | null;
  isReady: boolean;
  setPosition: (position: google.maps.LatLngLiteral) => void;
  getPosition: () => google.maps.LatLngLiteral | null;
  setPov: (pov: google.maps.StreetViewPov) => void;
  getPov: () => google.maps.StreetViewPov | null;
  setVisible: (visible: boolean) => void;
  isVisible: () => boolean;
}

export function useStreetView(
  containerId: string,
  options: UseStreetViewOptions = {}
): UseStreetViewReturn {
  const [instance, setInstance] = useState<StreetViewInstance | null>(null);
  const [isReady, setReady] = useState(false);

  const memoizedHandlers = useMemo(
    () => options.eventHandlers,
    [options.eventHandlers]
  );

  const initialize = useCallback(() => {
    if (!containerId || instance) return;

    try {
      const panorama = createStreetViewPanorama(
        containerId,
        options,
        memoizedHandlers
      );
      setInstance(panorama);
      setReady(true);
    } catch (error) {
      console.error('Failed to initialize Street View panorama:', error);
    }
  }, [containerId, instance, options, memoizedHandlers]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const setPosition = useCallback(
    (position: google.maps.LatLngLiteral) => {
      if (instance) {
        setStreetViewPosition(instance.panorama, position);
      }
    },
    [instance]
  );

  const getPosition = useCallback(() => {
    if (!instance) return null;
    return getStreetViewPosition(instance.panorama);
  }, [instance]);

  const setPov = useCallback(
    (pov: google.maps.StreetViewPov) => {
      if (instance) {
        setStreetViewPov(instance.panorama, pov);
      }
    },
    [instance]
  );

  const getPov = useCallback(() => {
    if (!instance) return null;
    return getStreetViewPov(instance.panorama);
  }, [instance]);

  const setVisible = useCallback(
    (visible: boolean) => {
      if (instance) {
        setStreetViewVisibility(instance.panorama, visible);
      }
    },
    [instance]
  );

  const isVisible = useCallback(() => {
    if (!instance) return false;
    return isStreetViewVisible(instance.panorama);
  }, [instance]);

  return {
    instance,
    isReady,
    setPosition,
    getPosition,
    setPov,
    getPov,
    setVisible,
    isVisible,
  };
}
