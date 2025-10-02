// Core types
export * from './types';

// Script loader
export {
  loadGoogleMaps,
  isGoogleMapsLoaded,
  waitForGoogleMaps,
} from './script-loader';

// Map utilities
export {
  createMap,
  getMapCenter,
  setMapCenter,
  getMapZoom,
  setMapZoom,
  fitMapToMarkers,
  panTo,
} from './map';

// Marker utilities
export {
  addMarker,
  removeMarker,
  updateMarkerPosition,
  updateMarkerContent,
  createInfoWindow,
  openInfoWindow,
  closeInfoWindow,
  addMarkerWithInfoWindow,
  clearMarkers,
  clearInfoWindows,
  getMarkerPosition,
  setMarkerDraggable,
  addMarkerClickListener,
  addMarkerDragListener,
  addMarkerDragEndListener,
} from './markers';

// Autocomplete utilities
export {
  createAutocomplete,
  bindAutocompleteToMap,
  getSelectedPlace,
  addPlaceChangedListener,
  setAutocompleteBounds,
  setAutocompleteComponentRestrictions,
  setAutocompleteTypes,
  getAutocompleteBounds,
  getAutocompleteComponentRestrictions,
  getAutocompleteTypes,
  clearAutocomplete,
  focusAutocomplete,
  createSearchBox,
  addPlacesChangedListener,
} from './autocomplete';

// Geocoding utilities
export {
  geocode,
  reverseGeocode,
  geocodeAsync,
  reverseGeocodeAsync,
  geocodeWithComponents,
  geocodeWithBounds,
  geocodeWithRegion,
  geocodeFirst,
  reverseGeocodeFirst,
} from './geocoding';

// Geocoding web service client
export { GeocodingClient, GeocodingApiError } from './geocoding-service';

export type {
  GeocodingClientOptions,
  GeocodeRequest,
  ReverseGeocodeRequest,
  GeocodingResponse,
  GeocodingResult,
  GeocodingStatus,
  GeocodingLatLngLiteral,
  GeocodingBounds,
  GeocodingGeometry,
  GeocodingAddressComponent,
  GeocodingPlusCode,
  GeocodingRetryConfig,
  GeocodingRetryStatus,
} from './geocoding-service';

// Directions utilities
export {
  getDirections,
  getDirectionsAsync,
  renderDirections,
  clearDirections,
  getDistanceMatrix,
  getDistanceMatrixAsync,
  createDirectionsService,
  createDirectionsRenderer,
  createDistanceMatrixService,
  getTotalDistance,
  getTotalDuration,
  getDirectionsBounds,
  fitMapToRoute,
} from './directions';

// Places web service utilities (Legacy API)
export {
  PlacesClient,
  PlacesApiError,
  createPlacesSessionToken,
} from './places';

export type {
  PlacesClientOptions,
  PlacesApiStatus,
  PlacesFindPlaceRequest,
  PlacesFindPlaceResponse,
  PlacesTextSearchRequest,
  PlacesTextSearchResponse,
  PlacesNearbySearchRequest,
  PlacesNearbySearchResponse,
  PlacesDetailsRequest,
  PlacesDetailsResponse,
  PlacesAutocompleteRequest,
  PlacesAutocompleteResponse,
  PlacesQueryAutocompleteRequest,
  PlacesQueryAutocompleteResponse,
  PlacesPlace,
  PlacesPrediction,
  PlacesLatLngLiteral,
  PlacesPhoto,
  PlacesGeometry,
  PlacesLocationBias,
  PlacesPhotoOptions,
  PlacesRetryConfig,
  PlacesRetryStatus,
} from './places';

// Places API (New) utilities
export { PlacesNewClient, PlacesNewApiError } from './places-new';

export type {
  PlacesNewClientOptions,
  PlacesNewApiStatus,
  PlacesNewLatLngLiteral,
  PlacesNewLocation,
  PlacesNewCircle,
  PlacesNewLocationRestriction,
  PlacesNewTextSearchRequest,
  PlacesNewTextSearchResponse,
  PlacesNewNearbySearchRequest,
  PlacesNewNearbySearchResponse,
  PlacesNewPlaceDetailsRequest,
  PlacesNewPlaceDetailsResponse,
  PlacesNewAutocompleteRequest,
  PlacesNewAutocompleteResponse,
  PlacesNewPhotoRequest,
  PlacesNewPhotoResponse,
  PlacesNewPlace,
  PlacesNewPhoto,
  PlacesNewAuthorAttribution,
  PlacesNewReview,
  PlacesNewOpeningHours,
  PlacesNewOpeningHoursPeriod,
  PlacesNewSuggestion,
  PlacesNewPlacePrediction,
  PlacesNewQueryPrediction,
  PlacesNewRetryConfig,
  PlacesNewRetryStatus,
} from './places-new';

// Street View utilities
export {
  createStreetViewPanorama,
  setStreetViewPosition,
  getStreetViewPosition,
  setStreetViewPov,
  getStreetViewPov,
  setStreetViewVisibility,
  isStreetViewVisible,
} from './street-view';

export type {
  StreetViewOptions,
  StreetViewEventHandlers,
  StreetViewInstance,
} from './types';
