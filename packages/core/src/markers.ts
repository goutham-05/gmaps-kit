/// <reference types="google.maps" />
import { MarkerOptions, InfoWindowOptions, MapInstance } from './types';

/**
 * Adds an advanced marker to the map
 * @param map - Google Maps instance
 * @param options - Marker configuration options
 * @returns The created advanced marker
 */
export function addMarker(
  map: google.maps.Map,
  options: MarkerOptions
): google.maps.marker.AdvancedMarkerElement {
  const marker = new google.maps.marker.AdvancedMarkerElement({
    position: options.position,
    map,
    title: options.title,
    content: options.content,
  });

  return marker;
}

/**
 * Removes an advanced marker from the map
 * @param marker - Advanced marker to remove
 */
export function removeMarker(
  marker: google.maps.marker.AdvancedMarkerElement
): void {
  marker.map = null;
}

/**
 * Updates advanced marker position
 * @param marker - Advanced marker to update
 * @param position - New position
 */
export function updateMarkerPosition(
  marker: google.maps.marker.AdvancedMarkerElement,
  position: google.maps.LatLngLiteral
): void {
  marker.position = position;
}

/**
 * Updates advanced marker content
 * @param marker - Advanced marker to update
 * @param content - New content
 */
export function updateMarkerContent(
  marker: google.maps.marker.AdvancedMarkerElement,
  content: HTMLElement
): void {
  marker.content = content;
}

/**
 * Creates an InfoWindow
 * @param options - InfoWindow configuration options
 * @returns The created InfoWindow
 */
export function createInfoWindow(
  options: InfoWindowOptions
): google.maps.InfoWindow {
  const infoWindow = new google.maps.InfoWindow({
    content: options.content,
    position: options.position,
    maxWidth: options.maxWidth,
    pixelOffset: options.pixelOffset,
    disableAutoPan: options.disableAutoPan,
  });

  return infoWindow;
}

/**
 * Opens an InfoWindow on a marker
 * @param infoWindow - InfoWindow to open
 * @param marker - Marker to attach the InfoWindow to
 * @param map - Map instance (optional, will use marker's map if not provided)
 */
export function openInfoWindow(
  infoWindow: google.maps.InfoWindow,
  marker: google.maps.marker.AdvancedMarkerElement,
  map?: google.maps.Map
): void {
  const targetMap = map || marker.map;
  if (targetMap) {
    infoWindow.open(targetMap, marker);
  }
}

/**
 * Closes an InfoWindow
 * @param infoWindow - InfoWindow to close
 */
export function closeInfoWindow(infoWindow: google.maps.InfoWindow): void {
  infoWindow.close();
}

/**
 * Adds a marker with InfoWindow to the map
 * @param map - Google Maps instance
 * @param markerOptions - Marker configuration options
 * @param infoWindowOptions - InfoWindow configuration options
 * @returns Object containing the marker and InfoWindow
 */
export function addMarkerWithInfoWindow(
  map: google.maps.Map,
  markerOptions: MarkerOptions,
  infoWindowOptions: InfoWindowOptions
): {
  marker: google.maps.marker.AdvancedMarkerElement;
  infoWindow: google.maps.InfoWindow;
} {
  const marker = addMarker(map, markerOptions);
  const infoWindow = createInfoWindow(infoWindowOptions);

  // Add click listener to open InfoWindow
  marker.addListener('click', () => {
    openInfoWindow(infoWindow, marker, map);
  });

  return { marker, infoWindow };
}

/**
 * Clears all markers from a map instance
 * @param mapInstance - Map instance containing markers
 */
export function clearMarkers(mapInstance: MapInstance): void {
  mapInstance.markers.forEach((marker) => {
    marker.map = null;
  });
  mapInstance.markers = [];
}

/**
 * Clears all InfoWindows from a map instance
 * @param mapInstance - Map instance containing InfoWindows
 */
export function clearInfoWindows(mapInstance: MapInstance): void {
  mapInstance.infoWindows.forEach((infoWindow) => {
    infoWindow.close();
  });
  mapInstance.infoWindows = [];
}

/**
 * Gets marker position
 * @param marker - Marker to get position from
 * @returns Marker position or null if not set
 */
export function getMarkerPosition(
  marker: google.maps.marker.AdvancedMarkerElement
): google.maps.LatLngLiteral | null {
  const position = marker.position;
  if (!position) return null;

  // Handle both LatLng and LatLngLiteral types
  if (typeof position.lat === 'function') {
    return {
      lat: (position.lat as () => number)(),
      lng: (position.lng as () => number)(),
    };
  } else {
    return { lat: position.lat as number, lng: position.lng as number };
  }
}

/**
 * Sets marker draggable state
 * @param marker - Marker to update
 * @param draggable - Whether the marker should be draggable
 */
export function setMarkerDraggable(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  marker: google.maps.marker.AdvancedMarkerElement,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  draggable: boolean
): void {
  // AdvancedMarkerElement doesn't support draggable property
  // This is a no-op for compatibility
}

/**
 * Adds a click listener to a marker
 * @param marker - Marker to add listener to
 * @param callback - Callback function to execute on click
 */
export function addMarkerClickListener(
  marker: google.maps.marker.AdvancedMarkerElement,
  callback: (event: google.maps.MapMouseEvent) => void
): void {
  marker.addListener('click', callback);
}

/**
 * Adds a drag listener to a marker
 * @param marker - Marker to add listener to
 * @param callback - Callback function to execute on drag
 */
export function addMarkerDragListener(
  marker: google.maps.marker.AdvancedMarkerElement,
  callback: (event: google.maps.MapMouseEvent) => void
): void {
  marker.addListener('drag', callback);
}

/**
 * Adds a drag end listener to a marker
 * @param marker - Marker to add listener to
 * @param callback - Callback function to execute on drag end
 */
export function addMarkerDragEndListener(
  marker: google.maps.marker.AdvancedMarkerElement,
  callback: (event: google.maps.MapMouseEvent) => void
): void {
  marker.addListener('dragend', callback);
}
