// Hooks
export { useGoogleMaps } from './hooks/useGoogleMaps';
export type {
  UseGoogleMapsOptions,
  UseGoogleMapsReturn,
} from './hooks/useGoogleMaps';

export { useMap } from './hooks/useMap';
export type { UseMapOptions, UseMapReturn } from './hooks/useMap';

export { useMarkers } from './hooks/useMarkers';
export type { MarkerOptions, UseMarkersReturn } from './hooks/useMarkers';

export { useGeocoding } from './hooks/useGeocoding';
export type { GeocodingResult, UseGeocodingReturn } from './hooks/useGeocoding';

export { usePlaces } from './hooks/usePlaces';
export type {
  UsePlacesOptions,
  UsePlacesReturn,
  PlacesHookError,
} from './hooks/usePlaces';

export { useGeocodingService } from './hooks/useGeocodingService';
export type {
  UseGeocodingServiceOptions,
  UseGeocodingServiceReturn,
  GeocodingServiceHookError,
} from './hooks/useGeocodingService';

export { useStreetView } from './hooks/useStreetView';
export type {
  UseStreetViewOptions,
  UseStreetViewReturn,
} from './hooks/useStreetView';

// Components
export { Map } from './components/Map';
export type { MapProps } from './components/Map';

export { Marker } from './components/Marker';
export type { MarkerProps } from './components/Marker';

export { InfoWindow } from './components/InfoWindow';
export type { InfoWindowProps } from './components/InfoWindow';

// Re-export core utilities for convenience
export * from '@gmaps-kit/core';
