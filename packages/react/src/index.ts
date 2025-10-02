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

export { usePlacesNew } from './hooks/usePlacesNew';
export type {
  UsePlacesNewOptions,
  UsePlacesNewReturn,
  PlacesNewHookError,
} from './hooks/usePlacesNew';

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

export { useBicycling } from './hooks/useBicycling';
export type {
  BicyclingOptions,
  UseBicyclingReturn,
} from './hooks/useBicycling';

export { useClustering, isMarkerClustererLoaded } from './hooks/useClustering';
export type {
  ClusterOptions,
  ClusterMarker,
  UseClusteringReturn,
} from './hooks/useClustering';

export { useDirections } from './hooks/useDirections';
export type {
  DirectionsRequest,
  DirectionsResult,
  UseDirectionsReturn,
} from './hooks/useDirections';

export { useDistanceMatrix } from './hooks/useDistanceMatrix';
export type {
  DistanceMatrixRequest,
  DistanceMatrixResult,
  UseDistanceMatrixReturn,
} from './hooks/useDistanceMatrix';

export { useElevation } from './hooks/useElevation';
export type {
  ElevationRequest,
  ElevationResult,
  UseElevationReturn,
} from './hooks/useElevation';

export { useGeometry } from './hooks/useGeometry';
export type {
  GeometryCalculation,
  UseGeometryReturn,
} from './hooks/useGeometry';

export { useHeatmap } from './hooks/useHeatmap';
export type {
  HeatmapData,
  HeatmapOptions,
  UseHeatmapReturn,
} from './hooks/useHeatmap';

export { useInfoWindows } from './hooks/useInfoWindows';
export type {
  InfoWindowOptions,
  UseInfoWindowsReturn,
} from './hooks/useInfoWindows';

export { useMapEvents } from './hooks/useMapEvents';
export type {
  MapEventHandlers,
  MapEventState,
  UseMapEventsReturn,
} from './hooks/useMapEvents';

export { useMaxZoom } from './hooks/useMaxZoom';
export type {
  MaxZoomRequest,
  MaxZoomResult,
  UseMaxZoomReturn,
} from './hooks/useMaxZoom';

export { useTraffic } from './hooks/useTraffic';
export type { TrafficOptions, UseTrafficReturn } from './hooks/useTraffic';

export { useTransit } from './hooks/useTransit';
export type { TransitOptions, UseTransitReturn } from './hooks/useTransit';

// Components
export { Map } from './components/Map';
export type { MapProps } from './components/Map';

export { Marker } from './components/Marker';
export type { MarkerProps } from './components/Marker';

export { InfoWindow } from './components/InfoWindow';
export type { InfoWindowProps } from './components/InfoWindow';

// Re-export core utilities for convenience
export * from '@gmaps-kit/core';
