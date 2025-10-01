/// <reference types="google.maps" />

// Core types for the gmaps-kit library
export interface MapOptions {
  center: google.maps.LatLngLiteral;
  zoom: number;
  mapTypeId?: google.maps.MapTypeId;
  mapId?: string;
  styles?: google.maps.MapTypeStyle[];
  disableDefaultUI?: boolean;
  zoomControl?: boolean;
  mapTypeControl?: boolean;
  scaleControl?: boolean;
  streetViewControl?: boolean;
  rotateControl?: boolean;
  fullscreenControl?: boolean;
}

export interface MarkerOptions {
  position: google.maps.LatLngLiteral;
  title?: string;
  content?: HTMLElement;
  draggable?: boolean;
  clickable?: boolean;
  zIndex?: number;
}

export interface InfoWindowOptions {
  content: string;
  position?: google.maps.LatLngLiteral;
  maxWidth?: number;
  pixelOffset?: google.maps.Size;
  disableAutoPan?: boolean;
}

export interface AutocompleteOptions {
  input: HTMLInputElement;
  bounds?: google.maps.LatLngBounds;
  componentRestrictions?: google.maps.places.ComponentRestrictions;
  fields?: string[];
  strictBounds?: boolean;
  types?: string[];
}

export interface GeocodingResult {
  address: string;
  location: google.maps.LatLngLiteral;
  placeId?: string;
  types?: string[];
}

export interface DirectionsOptions {
  origin: string | google.maps.LatLngLiteral;
  destination: string | google.maps.LatLngLiteral;
  travelMode?: google.maps.TravelMode;
  waypoints?: google.maps.DirectionsWaypoint[];
  optimizeWaypoints?: boolean;
  avoidHighways?: boolean;
  avoidTolls?: boolean;
}

export interface DistanceMatrixOptions {
  origins: (string | google.maps.LatLngLiteral)[];
  destinations: (string | google.maps.LatLngLiteral)[];
  travelMode?: google.maps.TravelMode;
  unitSystem?: google.maps.UnitSystem;
  avoidHighways?: boolean;
  avoidTolls?: boolean;
}

export interface DistanceMatrixResult {
  originIndex: number;
  destinationIndex: number;
  distance: {
    text: string;
    value: number;
  };
  duration: {
    text: string;
    value: number;
  };
  status: google.maps.DistanceMatrixElementStatus;
}

export interface MapEventHandlers {
  onClick?: (event: google.maps.MapMouseEvent) => void;
  onRightClick?: (event: google.maps.MapMouseEvent) => void;
  onDoubleClick?: (event: google.maps.MapMouseEvent) => void;
  onDrag?: () => void;
  onDragEnd?: () => void;
  onZoomChanged?: () => void;
  onBoundsChanged?: () => void;
  onCenterChanged?: () => void;
}

export interface ScriptLoaderOptions {
  apiKey: string;
  libraries?: string[];
  language?: string;
  region?: string;
  version?: string;
  callback?: string;
}

export interface MapInstance {
  map: google.maps.Map;
  markers: google.maps.marker.AdvancedMarkerElement[];
  infoWindows: google.maps.InfoWindow[];
  autocomplete?: google.maps.places.Autocomplete;
  directionsService?: google.maps.DirectionsService;
  directionsRenderer?: google.maps.DirectionsRenderer;
  distanceMatrixService?: google.maps.DistanceMatrixService;
}
