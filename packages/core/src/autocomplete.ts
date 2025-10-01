/// <reference types="google.maps" />
import { AutocompleteOptions, MapInstance } from './types';

/**
 * Creates a Places Autocomplete instance
 * @param options - Autocomplete configuration options
 * @returns The created Autocomplete instance
 */
export function createAutocomplete(
  options: AutocompleteOptions
): google.maps.places.Autocomplete {
  const autocomplete = new google.maps.places.Autocomplete(options.input, {
    bounds: options.bounds,
    componentRestrictions: options.componentRestrictions,
    fields: options.fields || [
      'place_id',
      'geometry',
      'name',
      'formatted_address',
    ],
    strictBounds: options.strictBounds,
    types: options.types,
  });

  return autocomplete;
}

/**
 * Binds an Autocomplete to a map instance
 * @param mapInstance - Map instance to bind to
 * @param options - Autocomplete configuration options
 * @returns The created Autocomplete instance
 */
export function bindAutocompleteToMap(
  mapInstance: MapInstance,
  options: AutocompleteOptions
): google.maps.places.Autocomplete {
  const autocomplete = createAutocomplete(options);
  mapInstance.autocomplete = autocomplete;

  // Add listener to update map when place is selected
  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace();
    if (place.geometry && place.geometry.location) {
      const location = place.geometry.location;
      mapInstance.map.setCenter(location);
      mapInstance.map.setZoom(15);
    }
  });

  return autocomplete;
}

/**
 * Gets the selected place from an Autocomplete
 * @param autocomplete - Autocomplete instance
 * @returns The selected place or null
 */
export function getSelectedPlace(
  autocomplete: google.maps.places.Autocomplete
): google.maps.places.PlaceResult | null {
  return autocomplete.getPlace();
}

/**
 * Adds a place changed listener to an Autocomplete
 * @param autocomplete - Autocomplete instance
 * @param callback - Callback function to execute when place changes
 */
export function addPlaceChangedListener(
  autocomplete: google.maps.places.Autocomplete,
  callback: (place: google.maps.places.PlaceResult) => void
): void {
  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace();
    callback(place);
  });
}

/**
 * Sets the bounds for an Autocomplete
 * @param autocomplete - Autocomplete instance
 * @param bounds - New bounds
 */
export function setAutocompleteBounds(
  autocomplete: google.maps.places.Autocomplete,
  bounds: google.maps.LatLngBounds
): void {
  autocomplete.setBounds(bounds);
}

/**
 * Sets the component restrictions for an Autocomplete
 * @param autocomplete - Autocomplete instance
 * @param restrictions - Component restrictions
 */
export function setAutocompleteComponentRestrictions(
  autocomplete: google.maps.places.Autocomplete,
  restrictions: google.maps.places.ComponentRestrictions
): void {
  autocomplete.setComponentRestrictions(restrictions);
}

/**
 * Sets the types for an Autocomplete
 * @param autocomplete - Autocomplete instance
 * @param types - Array of place types
 */
export function setAutocompleteTypes(
  autocomplete: google.maps.places.Autocomplete,
  types: string[]
): void {
  autocomplete.setTypes(types);
}

/**
 * Gets the current bounds of an Autocomplete
 * @param autocomplete - Autocomplete instance
 * @returns Current bounds or null
 */
export function getAutocompleteBounds(
  autocomplete: google.maps.places.Autocomplete
): google.maps.LatLngBounds | null {
  return autocomplete.getBounds() || null;
}

/**
 * Gets the current component restrictions of an Autocomplete
 * @param autocomplete - Autocomplete instance
 * @returns Current component restrictions or null
 */
export function getAutocompleteComponentRestrictions(
  autocomplete: google.maps.places.Autocomplete
): google.maps.places.ComponentRestrictions | null {
  return autocomplete.get('componentRestrictions') || null;
}

/**
 * Gets the current types of an Autocomplete
 * @param autocomplete - Autocomplete instance
 * @returns Current types array
 */
export function getAutocompleteTypes(
  autocomplete: google.maps.places.Autocomplete
): string[] {
  return autocomplete.get('types') || [];
}

/**
 * Clears the Autocomplete input
 * @param autocomplete - Autocomplete instance
 */
export function clearAutocomplete(
  autocomplete: google.maps.places.Autocomplete
): void {
  autocomplete.set('place', null);
}

/**
 * Focuses the Autocomplete input
 * @param autocomplete - Autocomplete instance
 */
export function focusAutocomplete(
  autocomplete: google.maps.places.Autocomplete
): void {
  autocomplete.getPlace();
}

/**
 * Creates a search box for Places API
 * @param input - HTML input element
 * @param map - Map instance to bind to
 * @param bounds - Optional bounds for search
 * @returns The created SearchBox instance
 */
export function createSearchBox(
  input: HTMLInputElement,
  map: google.maps.Map,
  bounds?: google.maps.LatLngBounds
): google.maps.places.SearchBox {
  const searchBox = new google.maps.places.SearchBox(input);

  if (bounds) {
    searchBox.setBounds(bounds);
  }

  // Bias the SearchBox results towards the map's viewport
  map.addListener('bounds_changed', () => {
    searchBox.setBounds(map.getBounds()!);
  });

  return searchBox;
}

/**
 * Adds a places changed listener to a SearchBox
 * @param searchBox - SearchBox instance
 * @param callback - Callback function to execute when places change
 */
export function addPlacesChangedListener(
  searchBox: google.maps.places.SearchBox,
  callback: (places: google.maps.places.PlaceResult[]) => void
): void {
  searchBox.addListener('places_changed', () => {
    const places = searchBox.getPlaces();
    callback(places || []);
  });
}
