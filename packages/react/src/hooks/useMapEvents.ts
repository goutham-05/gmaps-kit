import { useState, useCallback, useEffect } from 'react';
import { MapInstance } from '@gmaps-kit/core';

export interface MapEventHandlers {
  onClick?: (event: google.maps.MapMouseEvent) => void;
  onRightClick?: (event: google.maps.MapMouseEvent) => void;
  onDoubleClick?: (event: google.maps.MapMouseEvent) => void;
  onDrag?: () => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onZoomChanged?: () => void;
  onCenterChanged?: () => void;
  onBoundsChanged?: () => void;
  onIdle?: () => void;
  onTilesLoaded?: () => void;
  onHeadingChanged?: () => void;
  onTiltChanged?: () => void;
}

export interface MapEventState {
  isDragging: boolean;
  isZooming: boolean;
  lastClickPosition: google.maps.LatLngLiteral | null;
  lastRightClickPosition: google.maps.LatLngLiteral | null;
  currentZoom: number | null;
  currentCenter: google.maps.LatLngLiteral | null;
  currentBounds: google.maps.LatLngBounds | null;
}

export interface UseMapEventsReturn {
  eventState: MapEventState;
  addEventListeners: (
    mapInstance: MapInstance,
    handlers: MapEventHandlers
  ) => void;
  removeEventListeners: (mapInstance: MapInstance) => void;
  getCurrentMapState: (mapInstance: MapInstance) => MapEventState;
}

export function useMapEvents(): UseMapEventsReturn {
  const [eventState, setEventState] = useState<MapEventState>({
    isDragging: false,
    isZooming: false,
    lastClickPosition: null,
    lastRightClickPosition: null,
    currentZoom: null,
    currentCenter: null,
    currentBounds: null,
  });

  const [listeners, setListeners] = useState<google.maps.MapsEventListener[]>(
    []
  );

  const addEventListeners = useCallback(
    (mapInstance: MapInstance, handlers: MapEventHandlers) => {
      const map = mapInstance.map;
      const newListeners: google.maps.MapsEventListener[] = [];

      // Click events
      if (handlers.onClick) {
        const clickListener = map.addListener(
          'click',
          (event: google.maps.MapMouseEvent) => {
            if (event.latLng) {
              setEventState((prev) => ({
                ...prev,
                lastClickPosition: {
                  lat: event.latLng!.lat(),
                  lng: event.latLng!.lng(),
                },
              }));
            }
            handlers.onClick?.(event);
          }
        );
        newListeners.push(clickListener);
      }

      if (handlers.onRightClick) {
        const rightClickListener = map.addListener(
          'rightclick',
          (event: google.maps.MapMouseEvent) => {
            if (event.latLng) {
              setEventState((prev) => ({
                ...prev,
                lastRightClickPosition: {
                  lat: event.latLng!.lat(),
                  lng: event.latLng!.lng(),
                },
              }));
            }
            handlers.onRightClick?.(event);
          }
        );
        newListeners.push(rightClickListener);
      }

      if (handlers.onDoubleClick) {
        const doubleClickListener = map.addListener(
          'dblclick',
          handlers.onDoubleClick
        );
        newListeners.push(doubleClickListener);
      }

      // Drag events
      if (handlers.onDrag) {
        const dragListener = map.addListener('drag', () => {
          setEventState((prev) => ({ ...prev, isDragging: true }));
          handlers.onDrag?.();
        });
        newListeners.push(dragListener);
      }

      if (handlers.onDragStart) {
        const dragStartListener = map.addListener('dragstart', () => {
          setEventState((prev) => ({ ...prev, isDragging: true }));
          handlers.onDragStart?.();
        });
        newListeners.push(dragStartListener);
      }

      if (handlers.onDragEnd) {
        const dragEndListener = map.addListener('dragend', () => {
          setEventState((prev) => ({ ...prev, isDragging: false }));
          handlers.onDragEnd?.();
        });
        newListeners.push(dragEndListener);
      }

      // Zoom events
      if (handlers.onZoomChanged) {
        const zoomListener = map.addListener('zoom_changed', () => {
          setEventState((prev) => ({
            ...prev,
            currentZoom: map.getZoom() || null,
            isZooming: true,
          }));
          handlers.onZoomChanged?.();
        });
        newListeners.push(zoomListener);
      }

      // Center events
      if (handlers.onCenterChanged) {
        const centerListener = map.addListener('center_changed', () => {
          const center = map.getCenter();
          setEventState((prev) => ({
            ...prev,
            currentCenter: center
              ? { lat: center.lat(), lng: center.lng() }
              : null,
          }));
          handlers.onCenterChanged?.();
        });
        newListeners.push(centerListener);
      }

      // Bounds events
      if (handlers.onBoundsChanged) {
        const boundsListener = map.addListener('bounds_changed', () => {
          setEventState((prev) => ({
            ...prev,
            currentBounds: map.getBounds() || null,
          }));
          handlers.onBoundsChanged?.();
        });
        newListeners.push(boundsListener);
      }

      // Idle events
      if (handlers.onIdle) {
        const idleListener = map.addListener('idle', () => {
          setEventState((prev) => ({
            ...prev,
            isDragging: false,
            isZooming: false,
          }));
          handlers.onIdle?.();
        });
        newListeners.push(idleListener);
      }

      // Other events
      if (handlers.onTilesLoaded) {
        const tilesListener = map.addListener(
          'tilesloaded',
          handlers.onTilesLoaded
        );
        newListeners.push(tilesListener);
      }

      if (handlers.onHeadingChanged) {
        const headingListener = map.addListener(
          'heading_changed',
          handlers.onHeadingChanged
        );
        newListeners.push(headingListener);
      }

      if (handlers.onTiltChanged) {
        const tiltListener = map.addListener(
          'tilt_changed',
          handlers.onTiltChanged
        );
        newListeners.push(tiltListener);
      }

      setListeners((prev) => [...prev, ...newListeners]);
    },
    []
  );

  const removeEventListeners = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    (_mapInstance: MapInstance) => {
      listeners.forEach((listener) => {
        google.maps.event.removeListener(listener);
      });
      setListeners([]);
    },
    [listeners]
  );

  const getCurrentMapState = useCallback(
    (mapInstance: MapInstance): MapEventState => {
      const map = mapInstance.map;
      const center = map.getCenter();
      const bounds = map.getBounds();
      const zoom = map.getZoom();

      return {
        isDragging: false,
        isZooming: false,
        lastClickPosition: eventState.lastClickPosition,
        lastRightClickPosition: eventState.lastRightClickPosition,
        currentZoom: zoom || null,
        currentCenter: center ? { lat: center.lat(), lng: center.lng() } : null,
        currentBounds: bounds || null,
      };
    },
    [eventState.lastClickPosition, eventState.lastRightClickPosition]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      listeners.forEach((listener) => {
        google.maps.event.removeListener(listener);
      });
    };
  }, [listeners]);

  return {
    eventState,
    addEventListeners,
    removeEventListeners,
    getCurrentMapState,
  };
}
