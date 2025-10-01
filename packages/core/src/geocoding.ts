/// <reference types="google.maps" />
import { GeocodingResult } from './types';

/**
 * Geocodes an address to get coordinates
 * @param address - Address to geocode
 * @param callback - Callback function to handle results
 */
export function geocode(
  address: string,
  callback: (results: GeocodingResult[], status: google.maps.GeocoderStatus) => void
): void {
  const geocoder = new google.maps.Geocoder();
  
  geocoder.geocode({ address }, (results, status) => {
    if (status === google.maps.GeocoderStatus.OK && results) {
      const geocodingResults: GeocodingResult[] = results.map(result => ({
        address: result.formatted_address,
        location: {
          lat: result.geometry.location.lat(),
          lng: result.geometry.location.lng(),
        },
        placeId: result.place_id,
        types: result.types,
      }));
      callback(geocodingResults, status);
    } else {
      callback([], status);
    }
  });
}

/**
 * Reverse geocodes coordinates to get address
 * @param location - Coordinates to reverse geocode
 * @param callback - Callback function to handle results
 */
export function reverseGeocode(
  location: google.maps.LatLngLiteral,
  callback: (results: GeocodingResult[], status: google.maps.GeocoderStatus) => void
): void {
  const geocoder = new google.maps.Geocoder();
  
  geocoder.geocode({ location }, (results, status) => {
    if (status === google.maps.GeocoderStatus.OK && results) {
      const geocodingResults: GeocodingResult[] = results.map(result => ({
        address: result.formatted_address,
        location: {
          lat: result.geometry.location.lat(),
          lng: result.geometry.location.lng(),
        },
        placeId: result.place_id,
        types: result.types,
      }));
      callback(geocodingResults, status);
    } else {
      callback([], status);
    }
  });
}

/**
 * Geocodes an address and returns a Promise
 * @param address - Address to geocode
 * @returns Promise that resolves with geocoding results
 */
export function geocodeAsync(address: string): Promise<GeocodingResult[]> {
  return new Promise((resolve, reject) => {
    geocode(address, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        resolve(results);
      } else {
        reject(new Error(`Geocoding failed: ${status}`));
      }
    });
  });
}

/**
 * Reverse geocodes coordinates and returns a Promise
 * @param location - Coordinates to reverse geocode
 * @returns Promise that resolves with geocoding results
 */
export function reverseGeocodeAsync(location: google.maps.LatLngLiteral): Promise<GeocodingResult[]> {
  return new Promise((resolve, reject) => {
    reverseGeocode(location, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        resolve(results);
      } else {
        reject(new Error(`Reverse geocoding failed: ${status}`));
      }
    });
  });
}

/**
 * Geocodes an address with component restrictions
 * @param address - Address to geocode
 * @param componentRestrictions - Component restrictions
 * @param callback - Callback function to handle results
 */
export function geocodeWithComponents(
  address: string,
  componentRestrictions: google.maps.GeocoderComponentRestrictions,
  callback: (results: GeocodingResult[], status: google.maps.GeocoderStatus) => void
): void {
  const geocoder = new google.maps.Geocoder();
  
  geocoder.geocode({ 
    address,
    componentRestrictions 
  }, (results, status) => {
    if (status === google.maps.GeocoderStatus.OK && results) {
      const geocodingResults: GeocodingResult[] = results.map(result => ({
        address: result.formatted_address,
        location: {
          lat: result.geometry.location.lat(),
          lng: result.geometry.location.lng(),
        },
        placeId: result.place_id,
        types: result.types,
      }));
      callback(geocodingResults, status);
    } else {
      callback([], status);
    }
  });
}

/**
 * Geocodes an address with bounds
 * @param address - Address to geocode
 * @param bounds - Bounds to bias the results
 * @param callback - Callback function to handle results
 */
export function geocodeWithBounds(
  address: string,
  bounds: google.maps.LatLngBounds,
  callback: (results: GeocodingResult[], status: google.maps.GeocoderStatus) => void
): void {
  const geocoder = new google.maps.Geocoder();
  
  geocoder.geocode({ 
    address,
    bounds 
  }, (results, status) => {
    if (status === google.maps.GeocoderStatus.OK && results) {
      const geocodingResults: GeocodingResult[] = results.map(result => ({
        address: result.formatted_address,
        location: {
          lat: result.geometry.location.lat(),
          lng: result.geometry.location.lng(),
        },
        placeId: result.place_id,
        types: result.types,
      }));
      callback(geocodingResults, status);
    } else {
      callback([], status);
    }
  });
}

/**
 * Geocodes an address with region bias
 * @param address - Address to geocode
 * @param region - Region code to bias the results
 * @param callback - Callback function to handle results
 */
export function geocodeWithRegion(
  address: string,
  region: string,
  callback: (results: GeocodingResult[], status: google.maps.GeocoderStatus) => void
): void {
  const geocoder = new google.maps.Geocoder();
  
  geocoder.geocode({ 
    address,
    region 
  }, (results, status) => {
    if (status === google.maps.GeocoderStatus.OK && results) {
      const geocodingResults: GeocodingResult[] = results.map(result => ({
        address: result.formatted_address,
        location: {
          lat: result.geometry.location.lat(),
          lng: result.geometry.location.lng(),
        },
        placeId: result.place_id,
        types: result.types,
      }));
      callback(geocodingResults, status);
    } else {
      callback([], status);
    }
  });
}

/**
 * Gets the first result from geocoding
 * @param address - Address to geocode
 * @returns Promise that resolves with the first geocoding result
 */
export async function geocodeFirst(address: string): Promise<GeocodingResult> {
  const results = await geocodeAsync(address);
  if (results.length === 0) {
    throw new Error('No geocoding results found');
  }
  return results[0];
}

/**
 * Gets the first result from reverse geocoding
 * @param location - Coordinates to reverse geocode
 * @returns Promise that resolves with the first geocoding result
 */
export async function reverseGeocodeFirst(location: google.maps.LatLngLiteral): Promise<GeocodingResult> {
  const results = await reverseGeocodeAsync(location);
  if (results.length === 0) {
    throw new Error('No reverse geocoding results found');
  }
  return results[0];
}
