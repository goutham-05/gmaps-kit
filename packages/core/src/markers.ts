/// <reference types="google.maps" />
import { MarkerOptions, InfoWindowOptions, MapInstance } from './types';

/**
 * Adds a marker to the map
 * @param map - Google Maps instance
 * @param options - Marker configuration options
 * @returns The created marker
 */
export function addMarker(
  map: google.maps.Map,
  options: MarkerOptions
): google.maps.Marker {
  const marker = new google.maps.Marker({
    position: options.position,
    map,
    title: options.title,
    label: options.label,
    icon: options.icon,
    animation: options.animation,
    draggable: options.draggable,
    clickable: options.clickable,
    zIndex: options.zIndex,
  });

  return marker;
}

/**
 * Removes a marker from the map
 * @param marker - Marker to remove
 */
export function removeMarker(marker: google.maps.Marker): void {
  marker.setMap(null);
}

/**
 * Updates marker position
 * @param marker - Marker to update
 * @param position - New position
 */
export function updateMarkerPosition(
  marker: google.maps.Marker,
  position: google.maps.LatLngLiteral
): void {
  marker.setPosition(position);
}

/**
 * Updates marker icon
 * @param marker - Marker to update
 * @param icon - New icon
 */
export function updateMarkerIcon(
  marker: google.maps.Marker,
  icon: string | google.maps.Icon | google.maps.Symbol
): void {
  marker.setIcon(icon);
}

/**
 * Creates an InfoWindow
 * @param options - InfoWindow configuration options
 * @returns The created InfoWindow
 */
export function createInfoWindow(options: InfoWindowOptions): google.maps.InfoWindow {
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
  marker: google.maps.Marker,
  map?: google.maps.Map
): void {
  const targetMap = map || marker.getMap();
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
): { marker: google.maps.Marker; infoWindow: google.maps.InfoWindow } {
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
  mapInstance.markers.forEach(marker => {
    marker.setMap(null);
  });
  mapInstance.markers = [];
}

/**
 * Clears all InfoWindows from a map instance
 * @param mapInstance - Map instance containing InfoWindows
 */
export function clearInfoWindows(mapInstance: MapInstance): void {
  mapInstance.infoWindows.forEach(infoWindow => {
    infoWindow.close();
  });
  mapInstance.infoWindows = [];
}

/**
 * Gets marker position
 * @param marker - Marker to get position from
 * @returns Marker position or null if not set
 */
export function getMarkerPosition(marker: google.maps.Marker): google.maps.LatLngLiteral | null {
  const position = marker.getPosition();
  return position ? { lat: position.lat(), lng: position.lng() } : null;
}

/**
 * Sets marker visibility
 * @param marker - Marker to update
 * @param visible - Whether the marker should be visible
 */
export function setMarkerVisibility(marker: google.maps.Marker, visible: boolean): void {
  marker.setVisible(visible);
}

/**
 * Sets marker draggable state
 * @param marker - Marker to update
 * @param draggable - Whether the marker should be draggable
 */
export function setMarkerDraggable(marker: google.maps.Marker, draggable: boolean): void {
  marker.setDraggable(draggable);
}

/**
 * Adds a click listener to a marker
 * @param marker - Marker to add listener to
 * @param callback - Callback function to execute on click
 */
export function addMarkerClickListener(
  marker: google.maps.Marker,
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
  marker: google.maps.Marker,
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
  marker: google.maps.Marker,
  callback: (event: google.maps.MapMouseEvent) => void
): void {
  marker.addListener('dragend', callback);
}
