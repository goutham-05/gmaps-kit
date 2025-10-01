/// <reference types="google.maps" />
import { ScriptLoaderOptions } from './types';

/**
 * Loads the Google Maps JavaScript API script
 * @param options - Configuration options for the script loader
 * @returns Promise that resolves when the script is loaded
 */
export async function loadGoogleMaps(
  options: ScriptLoaderOptions
): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      resolve();
      return;
    }

    // Check if script is already being loaded
    const existingScript = document.querySelector(
      'script[src*="maps.googleapis.com"]'
    );
    if (existingScript) {
      // Wait for the existing script to load
      existingScript.addEventListener('load', () => resolve());
      existingScript.addEventListener('error', () =>
        reject(new Error('Failed to load Google Maps script'))
      );
      return;
    }

    // Create the script element
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.defer = true;

    // Build the URL with parameters
    const baseUrl = 'https://maps.googleapis.com/maps/api/js';
    const params = new URLSearchParams({
      key: options.apiKey,
      ...(options.libraries && { libraries: options.libraries.join(',') }),
      ...(options.language && { language: options.language }),
      ...(options.region && { region: options.region }),
      ...(options.version && { v: options.version }),
      ...(options.callback && { callback: options.callback }),
    });

    script.src = `${baseUrl}?${params.toString()}`;

    // Handle script load events
    script.addEventListener('load', () => {
      if (window.google && window.google.maps) {
        resolve();
      } else {
        reject(new Error('Google Maps API failed to initialize'));
      }
    });

    script.addEventListener('error', () => {
      reject(new Error('Failed to load Google Maps script'));
    });

    // Add script to document head
    document.head.appendChild(script);
  });
}

/**
 * Checks if Google Maps is already loaded
 * @returns boolean indicating if Google Maps is available
 */
export function isGoogleMapsLoaded(): boolean {
  return !!(window.google && window.google.maps);
}

/**
 * Waits for Google Maps to be available
 * @param timeout - Maximum time to wait in milliseconds (default: 10000)
 * @returns Promise that resolves when Google Maps is available
 */
export function waitForGoogleMaps(timeout = 10000): Promise<void> {
  return new Promise((resolve, reject) => {
    if (isGoogleMapsLoaded()) {
      resolve();
      return;
    }

    const startTime = Date.now();
    const checkInterval = setInterval(() => {
      if (isGoogleMapsLoaded()) {
        clearInterval(checkInterval);
        resolve();
      } else if (Date.now() - startTime > timeout) {
        clearInterval(checkInterval);
        reject(new Error('Timeout waiting for Google Maps to load'));
      }
    }, 100);
  });
}
