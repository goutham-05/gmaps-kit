/// <reference types="google.maps" />
import {
  DirectionsOptions,
  DistanceMatrixOptions,
  DistanceMatrixResult,
  MapInstance,
} from './types';

/**
 * Gets directions between two points
 * @param options - Directions configuration options
 * @param callback - Callback function to handle results
 */
export function getDirections(
  options: DirectionsOptions,
  callback: (
    result: google.maps.DirectionsResult | null,
    status: google.maps.DirectionsStatus
  ) => void
): void {
  const directionsService = new google.maps.DirectionsService();

  const request: google.maps.DirectionsRequest = {
    origin: options.origin,
    destination: options.destination,
    travelMode: options.travelMode || google.maps.TravelMode.DRIVING,
    waypoints: options.waypoints,
    optimizeWaypoints: options.optimizeWaypoints,
    avoidHighways: options.avoidHighways,
    avoidTolls: options.avoidTolls,
  };

  directionsService.route(request, (result, status) => {
    callback(result, status);
  });
}

/**
 * Gets directions between two points and returns a Promise
 * @param options - Directions configuration options
 * @returns Promise that resolves with directions result
 */
export function getDirectionsAsync(
  options: DirectionsOptions
): Promise<google.maps.DirectionsResult> {
  return new Promise((resolve, reject) => {
    getDirections(options, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK && result) {
        resolve(result);
      } else {
        reject(new Error(`Directions request failed: ${status}`));
      }
    });
  });
}

/**
 * Renders directions on a map
 * @param map - Map instance to render directions on
 * @param directionsResult - Directions result to render
 * @param options - Optional renderer options
 * @returns The directions renderer
 */
export function renderDirections(
  map: google.maps.Map,
  directionsResult: google.maps.DirectionsResult,
  options?: google.maps.DirectionsRendererOptions
): google.maps.DirectionsRenderer {
  const directionsRenderer = new google.maps.DirectionsRenderer(options);
  directionsRenderer.setMap(map);
  directionsRenderer.setDirections(directionsResult);
  return directionsRenderer;
}

/**
 * Clears directions from a map
 * @param directionsRenderer - Directions renderer to clear
 */
export function clearDirections(
  directionsRenderer: google.maps.DirectionsRenderer
): void {
  directionsRenderer.setMap(null);
}

/**
 * Gets distance matrix between multiple origins and destinations
 * @param options - Distance matrix configuration options
 * @param callback - Callback function to handle results
 */
export function getDistanceMatrix(
  options: DistanceMatrixOptions,
  callback: (
    result: DistanceMatrixResult[],
    status: google.maps.DistanceMatrixStatus
  ) => void
): void {
  const distanceMatrixService = new google.maps.DistanceMatrixService();

  const request: google.maps.DistanceMatrixRequest = {
    origins: options.origins,
    destinations: options.destinations,
    travelMode: options.travelMode || google.maps.TravelMode.DRIVING,
    unitSystem: options.unitSystem || google.maps.UnitSystem.METRIC,
    avoidHighways: options.avoidHighways,
    avoidTolls: options.avoidTolls,
  };

  distanceMatrixService.getDistanceMatrix(request, (result, status) => {
    if (status === google.maps.DistanceMatrixStatus.OK && result) {
      const distanceMatrixResults: DistanceMatrixResult[] = [];

      result.rows.forEach((row, rowIndex) => {
        row.elements.forEach((element, elementIndex) => {
          distanceMatrixResults.push({
            originIndex: rowIndex,
            destinationIndex: elementIndex,
            distance: {
              text: element.distance.text,
              value: element.distance.value,
            },
            duration: {
              text: element.duration.text,
              value: element.duration.value,
            },
            status: element.status,
          });
        });
      });

      callback(distanceMatrixResults, status);
    } else {
      callback([], status);
    }
  });
}

/**
 * Gets distance matrix between multiple origins and destinations and returns a Promise
 * @param options - Distance matrix configuration options
 * @returns Promise that resolves with distance matrix results
 */
export function getDistanceMatrixAsync(
  options: DistanceMatrixOptions
): Promise<DistanceMatrixResult[]> {
  return new Promise((resolve, reject) => {
    getDistanceMatrix(options, (result, status) => {
      if (status === google.maps.DistanceMatrixStatus.OK) {
        resolve(result);
      } else {
        reject(new Error(`Distance matrix request failed: ${status}`));
      }
    });
  });
}

/**
 * Creates a directions service for a map instance
 * @param mapInstance - Map instance to create service for
 * @returns The directions service
 */
export function createDirectionsService(
  mapInstance: MapInstance
): google.maps.DirectionsService {
  const directionsService = new google.maps.DirectionsService();
  mapInstance.directionsService = directionsService;
  return directionsService;
}

/**
 * Creates a directions renderer for a map instance
 * @param mapInstance - Map instance to create renderer for
 * @param options - Optional renderer options
 * @returns The directions renderer
 */
export function createDirectionsRenderer(
  mapInstance: MapInstance,
  options?: google.maps.DirectionsRendererOptions
): google.maps.DirectionsRenderer {
  const directionsRenderer = new google.maps.DirectionsRenderer(options);
  directionsRenderer.setMap(mapInstance.map);
  mapInstance.directionsRenderer = directionsRenderer;
  return directionsRenderer;
}

/**
 * Creates a distance matrix service for a map instance
 * @param mapInstance - Map instance to create service for
 * @returns The distance matrix service
 */
export function createDistanceMatrixService(
  mapInstance: MapInstance
): google.maps.DistanceMatrixService {
  const distanceMatrixService = new google.maps.DistanceMatrixService();
  mapInstance.distanceMatrixService = distanceMatrixService;
  return distanceMatrixService;
}

/**
 * Gets the total distance from a directions result
 * @param directionsResult - Directions result to calculate distance from
 * @returns Total distance in meters
 */
export function getTotalDistance(
  directionsResult: google.maps.DirectionsResult
): number {
  let totalDistance = 0;

  directionsResult.routes.forEach((route) => {
    route.legs.forEach((leg) => {
      totalDistance += leg.distance?.value || 0;
    });
  });

  return totalDistance;
}

/**
 * Gets the total duration from a directions result
 * @param directionsResult - Directions result to calculate duration from
 * @returns Total duration in seconds
 */
export function getTotalDuration(
  directionsResult: google.maps.DirectionsResult
): number {
  let totalDuration = 0;

  directionsResult.routes.forEach((route) => {
    route.legs.forEach((leg) => {
      totalDuration += leg.duration?.value || 0;
    });
  });

  return totalDuration;
}

/**
 * Gets the bounds of a directions result
 * @param directionsResult - Directions result to get bounds from
 * @returns Bounds of the route
 */
export function getDirectionsBounds(
  directionsResult: google.maps.DirectionsResult
): google.maps.LatLngBounds {
  const bounds = new google.maps.LatLngBounds();

  directionsResult.routes.forEach((route) => {
    route.overview_path.forEach((point) => {
      bounds.extend(point);
    });
  });

  return bounds;
}

/**
 * Fits a map to show the entire route
 * @param map - Map instance to fit
 * @param directionsResult - Directions result to fit to
 * @param padding - Optional padding around the bounds
 */
export function fitMapToRoute(
  map: google.maps.Map,
  directionsResult: google.maps.DirectionsResult,
  padding?: number
): void {
  const bounds = getDirectionsBounds(directionsResult);
  map.fitBounds(bounds, padding);
}
