/// <reference types="google.maps" />
import { MapOptions, MapInstance, MapEventHandlers } from './types';

/**
 * Creates a new Google Maps instance
 * @param container - HTML element or element ID to render the map
 * @param options - Map configuration options
 * @param eventHandlers - Optional event handlers
 * @returns MapInstance with the map and utility methods
 */
export function createMap(
  container: HTMLElement | string,
  options: MapOptions,
  eventHandlers?: MapEventHandlers
): MapInstance {
  // Ensure Google Maps is loaded
  if (!window.google || !window.google.maps) {
    throw new Error(
      'Google Maps API is not loaded. Call loadGoogleMaps() first.'
    );
  }

  // Get the container element
  const mapContainer =
    typeof container === 'string'
      ? document.getElementById(container)
      : container;

  if (!mapContainer) {
    throw new Error('Map container element not found');
  }

  // Create the map
  const map = new google.maps.Map(mapContainer, {
    center: options.center,
    zoom: options.zoom,
    mapTypeId: options.mapTypeId || google.maps.MapTypeId.ROADMAP,
    mapId: options.mapId || 'DEMO_MAP_ID',
    styles: options.styles,
    disableDefaultUI: options.disableDefaultUI,
    zoomControl: options.zoomControl,
    mapTypeControl: options.mapTypeControl,
    scaleControl: options.scaleControl,
    streetViewControl: options.streetViewControl,
    rotateControl: options.rotateControl,
    fullscreenControl: options.fullscreenControl,
  });

  // Create the map instance
  const mapInstance: MapInstance = {
    map,
    markers: [],
    infoWindows: [],
  };

  // Attach event handlers if provided
  if (eventHandlers) {
    attachMapEventHandlers(map, eventHandlers);
  }

  return mapInstance;
}

/**
 * Attaches event handlers to a map instance
 * @param map - Google Maps instance
 * @param handlers - Event handlers to attach
 */
function attachMapEventHandlers(
  map: google.maps.Map,
  handlers: MapEventHandlers
): void {
  if (handlers.onClick) {
    map.addListener('click', handlers.onClick);
  }
  if (handlers.onRightClick) {
    map.addListener('rightclick', handlers.onRightClick);
  }
  if (handlers.onDoubleClick) {
    map.addListener('dblclick', handlers.onDoubleClick);
  }
  if (handlers.onDrag) {
    map.addListener('drag', handlers.onDrag);
  }
  if (handlers.onDragEnd) {
    map.addListener('dragend', handlers.onDragEnd);
  }
  if (handlers.onZoomChanged) {
    map.addListener('zoom_changed', handlers.onZoomChanged);
  }
  if (handlers.onBoundsChanged) {
    map.addListener('bounds_changed', handlers.onBoundsChanged);
  }
  if (handlers.onCenterChanged) {
    map.addListener('center_changed', handlers.onCenterChanged);
  }
}

/**
 * Gets the current center of the map
 * @param map - Google Maps instance
 * @returns Current center coordinates
 */
export function getMapCenter(map: google.maps.Map): google.maps.LatLngLiteral {
  const center = map.getCenter();
  return center ? { lat: center.lat(), lng: center.lng() } : { lat: 0, lng: 0 };
}

/**
 * Sets the center of the map
 * @param map - Google Maps instance
 * @param center - New center coordinates
 */
export function setMapCenter(
  map: google.maps.Map,
  center: google.maps.LatLngLiteral
): void {
  map.setCenter(center);
}

/**
 * Gets the current zoom level
 * @param map - Google Maps instance
 * @returns Current zoom level
 */
export function getMapZoom(map: google.maps.Map): number {
  return map.getZoom() || 0;
}

/**
 * Sets the zoom level of the map
 * @param map - Google Maps instance
 * @param zoom - New zoom level
 */
export function setMapZoom(map: google.maps.Map, zoom: number): void {
  map.setZoom(zoom);
}

/**
 * Fits the map to show all markers
 * @param map - Google Maps instance
 * @param markers - Array of markers to fit
 * @param padding - Optional padding around the bounds
 */
export function fitMapToMarkers(
  map: google.maps.Map,
  markers: google.maps.Marker[],
  padding?: number
): void {
  if (markers.length === 0) return;

  const bounds = new google.maps.LatLngBounds();
  markers.forEach((marker) => {
    const position = marker.getPosition();
    if (position) {
      bounds.extend(position);
    }
  });

  map.fitBounds(bounds, padding);
}

/**
 * Pans the map to a specific location
 * @param map - Google Maps instance
 * @param center - Target center coordinates
 * @param zoom - Optional zoom level
 */
export function panTo(
  map: google.maps.Map,
  center: google.maps.LatLngLiteral,
  zoom?: number
): void {
  map.panTo(center);
  if (zoom !== undefined) {
    map.setZoom(zoom);
  }
}
