/// <reference types="google.maps" />
import {
  StreetViewOptions,
  StreetViewEventHandlers,
  StreetViewInstance,
} from './types';

/**
 * Creates a Street View panorama instance.
 */
export function createStreetViewPanorama(
  container: HTMLElement | string,
  options: StreetViewOptions = {},
  eventHandlers?: StreetViewEventHandlers
): StreetViewInstance {
  if (!window.google || !window.google.maps) {
    throw new Error('Google Maps API is not loaded. Call loadGoogleMaps() first.');
  }

  const element =
    typeof container === 'string'
      ? document.getElementById(container)
      : container;

  if (!element) {
    throw new Error('Street View container element not found');
  }

  const panorama = new google.maps.StreetViewPanorama(element, {
    position: options.position,
    pov: options.pov,
    zoom: options.zoom,
    visible: options.visible,
  });

  if (eventHandlers) {
    attachStreetViewEventHandlers(panorama, eventHandlers);
  }

  return { panorama };
}

function attachStreetViewEventHandlers(
  panorama: google.maps.StreetViewPanorama,
  handlers: StreetViewEventHandlers
): void {
  if (handlers.onPovChanged) {
    panorama.addListener('pov_changed', handlers.onPovChanged);
  }
  if (handlers.onPositionChanged) {
    panorama.addListener('position_changed', handlers.onPositionChanged);
  }
  if (handlers.onVisibilityChanged) {
    panorama.addListener('visible_changed', handlers.onVisibilityChanged);
  }
}

export function setStreetViewPosition(
  panorama: google.maps.StreetViewPanorama,
  position: google.maps.LatLngLiteral
): void {
  panorama.setPosition(position);
}

export function getStreetViewPosition(
  panorama: google.maps.StreetViewPanorama
): google.maps.LatLngLiteral | null {
  const position = panorama.getPosition();
  if (!position) return null;
  return { lat: position.lat(), lng: position.lng() };
}

export function setStreetViewPov(
  panorama: google.maps.StreetViewPanorama,
  pov: google.maps.StreetViewPov
): void {
  panorama.setPov(pov);
}

export function getStreetViewPov(
  panorama: google.maps.StreetViewPanorama
): google.maps.StreetViewPov {
  return panorama.getPov();
}

export function setStreetViewVisibility(
  panorama: google.maps.StreetViewPanorama,
  visible: boolean
): void {
  panorama.setVisible(visible);
}

export function isStreetViewVisible(
  panorama: google.maps.StreetViewPanorama
): boolean {
  return panorama.getVisible();
}
