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
  updateMarkerIcon,
  createInfoWindow,
  openInfoWindow,
  closeInfoWindow,
  addMarkerWithInfoWindow,
  clearMarkers,
  clearInfoWindows,
  getMarkerPosition,
  setMarkerVisibility,
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
